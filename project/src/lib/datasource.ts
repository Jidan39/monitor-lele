import type { ConnectionMode, FirebaseConfig, Reading } from './types';
import { FIREBASE_DATA_PATH, FIREBASE_HISTORY_PATH } from './types';

export type DataCallback = (reading: Reading) => void;
export type HistoryCallback = (readings: Reading[]) => void;
export type StatusCallback = (connected: boolean, error: string | null) => void;

export interface DataSource {
  start(): void;
  stop(): void;
}

function parseReading(raw: unknown): Reading | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const rawTs = r.timestamp;

  // Kalau timestamp valid (unix epoch dalam ms), pakai. Kalau tidak, pakai waktu sekarang.
  const ts =
    typeof rawTs === 'number' && rawTs > 1e12 ? rawTs : Date.now();

  const reading: Reading = {
    timestamp: ts,
    tds: Number(r.tds ?? r.TDS ?? 0),
    temperature: Number(r.temperature ?? r.temp ?? 0),
    ph: Number(r.ph ?? r.pH ?? 0),
    turbidity: Number(r.turbidity ?? r.turb ?? 0),
  };
  if (Number.isNaN(reading.tds) || Number.isNaN(reading.temperature) || Number.isNaN(reading.ph) || Number.isNaN(reading.turbidity)) {
    return null;
  }
  return reading;
}

function parseHistory(raw: unknown): Reading[] {
  if (typeof raw !== 'object' || raw === null) return [];
  const obj = raw as Record<string, unknown>;
  const out: Reading[] = [];
  for (const key of Object.keys(obj)) {
    const r = parseReading(obj[key]);
    if (r) out.push(r);
  }
  return out.sort((a, b) => a.timestamp - b.timestamp);
}

// Demo generator — simulates realistic water quality readings
function makeDemoReading(): Reading {
  const t = Date.now();
  const phase = t / 60000; // slow drift per minute
  return {
    timestamp: t,
    tds: 180 + Math.sin(phase * 0.3) * 40 + (Math.random() - 0.5) * 15,
    temperature: 25 + Math.sin(phase * 0.2) * 2 + (Math.random() - 0.5) * 0.4,
    ph: 7.2 + Math.sin(phase * 0.15) * 0.3 + (Math.random() - 0.5) * 0.05,
    turbidity: 1.5 + Math.sin(phase * 0.25) * 1 + Math.max(0, (Math.random() - 0.5) * 0.8),
  };
}

export function createDataSource(
  mode: ConnectionMode,
  endpoint: string,
  mqttTopic: string,
  restUrl: string,
  intervalMs: number,
  onData: DataCallback,
  onStatus: StatusCallback,
  firebase?: FirebaseConfig,
  onHistory?: HistoryCallback
): DataSource {
  let timer: ReturnType<typeof setInterval> | null = null;
  let ws: WebSocket | null = null;
  let mqttClient: { end: () => void } | null = null;
  let restTimer: ReturnType<typeof setInterval> | null = null;
  let unsubscribe: (() => void) | null = null;
  let historyUnsubscribe: (() => void) | null = null;
  let stopped = false;

  function clearTimers() {
    if (timer) clearInterval(timer);
    if (restTimer) clearInterval(restTimer);
    timer = null;
    restTimer = null;
  }

  function startDemo() {
    onStatus(true, null);
    onData(makeDemoReading());
    timer = setInterval(() => {
      if (!stopped) onData(makeDemoReading());
      }, intervalMs);
  }

  function startWebSocket() {
    try {
      onStatus(false, null);
      ws = new WebSocket(endpoint);
      ws.onopen = () => onStatus(true, null);
      ws.onmessage = (ev) => {
        try {
          const raw = JSON.parse(ev.data as string);
          const reading = parseReading(raw);
          if (reading) onData(reading);
        } catch {
          // ignore malformed
        }
      };
      ws.onerror = () => {
        onStatus(false, 'Koneksi WebSocket gagal. Periksa alamat server.');
      };
      ws.onclose = () => {
        if (!stopped) onStatus(false, 'Koneksi WebSocket ditutup.');
      };
    } catch (e) {
      onStatus(false, `WebSocket error: ${e instanceof Error ? e.message : 'unknown'}`);
      startDemo();
    }
  }

  async function startMqtt() {
    try {
      onStatus(false, null);
      const mqtt = await import('mqtt');
      const client = mqtt.connect(endpoint);
      mqttClient = client;
      client.on('connect', () => {
        onStatus(true, null);
        client.subscribe(mqttTopic);
      });
      client.on('message', (_topic, payload) => {
        try {
          const raw = JSON.parse(payload.toString());
          const reading = parseReading(raw);
          if (reading) onData(reading);
        } catch {
          // ignore
        }
      });
      client.on('error', (err: Error) => {
        onStatus(false, `MQTT error: ${err.message}`);
      });
    } catch (e) {
      onStatus(false, `MQTT tidak tersedia: ${e instanceof Error ? e.message : 'unknown'}`);
      startDemo();
    }
  }

  async function startRest() {
    onStatus(false, null);
    const poll = async () => {
      if (stopped) return;
      try {
        const res = await fetch(restUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw = await res.json();
        const reading = parseReading(raw);
        if (reading) {
          onData(reading);
          onStatus(true, null);
          }
      } catch (e) {
        onStatus(false, `REST error: ${e instanceof Error ? e.message : 'unknown'}`);
      }
    };
    await poll();
    restTimer = setInterval(poll, intervalMs);
  }

  function startFirebase() {
    onStatus(false, null);
    import('firebase/app')
      .then(({ initializeApp }) => {
        if (stopped || !firebase) return null;
        const app = initializeApp(firebase);
        return import('firebase/database').then((dbMod) => ({ app, dbMod }));
      })
      .then((res) => {
        if (stopped || !res) return;
        const { ref, onValue } = res.dbMod;
        const db = res.dbMod.getDatabase(res.app);

        // Real-time /sensor
        const sensorRef = ref(db, FIREBASE_DATA_PATH);
        unsubscribe = onValue(
          sensorRef,
          (snap) => {
            if (stopped) return;
            const raw = snap.val();
            const reading = parseReading(raw);
            if (reading) onData(reading);
          },
          (err: Error) => {
            if (!stopped) onStatus(false, `Firebase error: ${err.message}`);
          }
        );

        // History /history
        if (onHistory) {
          const historyRef = ref(db, FIREBASE_HISTORY_PATH);
          historyUnsubscribe = onValue(
            historyRef,
            (snap) => {
              if (stopped) return;
              const raw = snap.val();
              const history = parseHistory(raw);
              onHistory(history);
            },
            (err: Error) => {
              if (!stopped) console.error('Firebase history error:', err.message);
            }
          );
        }

        onStatus(true, null);
      })
      .catch((e) => {
        if (!stopped)
          onStatus(false, `Firebase gagal: ${e instanceof Error ? e.message : 'unknown'}`);
      });
  }

  return {
    start() {
      stopped = false;
      switch (mode) {
        case 'demo':
          startDemo();
          break;
        case 'websocket':
          startWebSocket();
          break;
        case 'mqtt':
          startMqtt();
          break;
        case 'rest':
          startRest();
          break;
        case 'firebase':
          startFirebase();
          break;
      }
    },
    stop() {
      stopped = true;
      clearTimers();
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
      if (historyUnsubscribe) {
        historyUnsubscribe();
        historyUnsubscribe = null;
      }
      if (ws) {
        ws.onclose = null;
        ws.close();
        ws = null;
      }
      if (mqttClient) {
        mqttClient.end();
        mqttClient = null;
      }
    },
  };
}