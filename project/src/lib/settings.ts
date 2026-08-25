import type { FirebaseConfig, Settings } from './types';
import { DEFAULT_THRESHOLDS } from './types';

const STORAGE_KEY = 'water-monitor-settings-v1';

export const DEFAULT_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: 'AIzaSyD68mfsdluFLQPUrnueAlaQGACjszu45n0',
  authDomain: 'monitoring-lele.firebaseapp.com',
  databaseURL:
    'https://monitoring-lele-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'monitoring-lele',
  storageBucket: 'monitoring-lele.firebasestorage.app',
  messagingSenderId: '453130132991',
  appId: '1:453130132991:web:b435df67fe29d6e22edbca',
};

export const DEFAULT_SETTINGS: Settings = {
  connectionMode: 'demo',
  serverUrl: 'ws://192.168.1.100:81',
  mqttTopic: 'water/quality',
  restUrl: 'http://192.168.1.100/data',
  updateIntervalMs: 2000,
  thresholds: DEFAULT_THRESHOLDS,
  firebase: DEFAULT_FIREBASE_CONFIG,
};

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      thresholds: {
        ...DEFAULT_THRESHOLDS,
        ...(parsed.thresholds ?? {}),
      },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}
