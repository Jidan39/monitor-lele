import { useCallback, useEffect, useRef, useState } from 'react';
import type { ConnectionStatus, Reading, Settings } from '@/lib/types';
import { createDataSource, type DataSource } from '@/lib/datasource';

export function useWaterData(settings: Settings) {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [latest, setLatest] = useState<Reading | null>(null);
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
    setLatest(null);
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
        setLatest(reading);
        // Mode Firebase: riwayat hanya dari /history, /sensor tidak dicatat sebagai baris baru
        if (settings.connectionMode !== 'firebase') {
          setReadings((prev) => [...prev, reading]);
        }
      },
      (connected, error) => {
        setStatus((prev) => ({ ...prev, connected, error }));
      },
      settings.firebase,
      (history) => {
        // Snapshot /history selalu berisi seluruh data, jadi langsung ganti
        setReadings(history);
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

  return { readings, latest, status, reconnect: start };
}