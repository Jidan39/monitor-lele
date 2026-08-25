import { useCallback, useEffect, useRef, useState } from 'react';
import type { ConnectionStatus, Reading, Settings } from '@/lib/types';
import { createDataSource, type DataSource } from '@/lib/datasource';

const MAX_HISTORY = 720; // 24h at 2min intervals; enough for rolling window

export function useWaterData(settings: Settings) {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>({
    connected: false,
    mode: settings.connectionMode,
    endpoint: settings.serverUrl,
    error: null,
  });
  const sourceRef = useRef<DataSource | null>(null);

  const endpoint =
    settings.connectionMode === 'mqtt'
      ? settings.serverUrl
      : settings.connectionMode === 'rest'
        ? settings.restUrl
        : settings.serverUrl;

  const start = useCallback(() => {
    sourceRef.current?.stop();
    setReadings([]);
    setStatus({
      connected: false,
      mode: settings.connectionMode,
      endpoint,
      error: null,
    });

    const source = createDataSource(
      settings.connectionMode,
      settings.serverUrl,
      settings.mqttTopic,
      settings.restUrl,
      settings.updateIntervalMs,
      (reading) => {
        setReadings((prev) => {
          const next = [...prev, reading];
          if (next.length > MAX_HISTORY) next.shift();
          return next;
        });
      },
      (connected, error) => {
        setStatus((prev) => ({ ...prev, connected, error }));
      },
      settings.firebase,
      (history) => {
        // Gabung history dari Firebase dengan data realtime
        setReadings((prev) => {
          const all = [...history, ...prev];
          all.sort((a, b) => a.timestamp - b.timestamp);
          // Hapus duplikat berdasarkan timestamp (sama sampai detik)
          const unique = new Map<number, Reading>();
          for (const r of all) {
            const key = Math.floor(r.timestamp / 1000);
            unique.set(key, r);
          }
          const result = Array.from(unique.values()).sort((a, b) => a.timestamp - b.timestamp);
          if (result.length > MAX_HISTORY) result.splice(0, result.length - MAX_HISTORY);
          return result;
        });
      }
    );
    sourceRef.current = source;
    source.start();
  }, [settings.connectionMode, settings.serverUrl, settings.mqttTopic, settings.restUrl, settings.updateIntervalMs, endpoint, settings.firebase]);

  useEffect(() => {
    start();
    return () => {
      sourceRef.current?.stop();
      sourceRef.current = null;
    };
  }, [start]);

  return { readings, status, reconnect: start };
}