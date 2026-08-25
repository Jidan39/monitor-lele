export type ParameterKey = 'tds' | 'temperature' | 'ph' | 'turbidity';

export interface Reading {
  timestamp: number;
  tds: number;
  temperature: number;
  ph: number;
  turbidity: number;
}

export type ConnectionMode = 'demo' | 'websocket' | 'mqtt' | 'rest' | 'firebase';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

/** Path node di Firebase Realtime Database tempat ESP32 menulis data sensor */
export const FIREBASE_DATA_PATH = 'sensor';
export const FIREBASE_HISTORY_PATH = 'history';

export type StatusLevel = 'good' | 'warning' | 'bad';

export interface Threshold {
  min: number;
  max: number;
  warningMin: number;
  warningMax: number;
}

export type Thresholds = Record<ParameterKey, Threshold>;

export interface Settings {
  connectionMode: ConnectionMode;
  serverUrl: string;
  mqttTopic: string;
  restUrl: string;
  updateIntervalMs: number;
  thresholds: Thresholds;
  firebase: FirebaseConfig;
}

export interface ConnectionStatus {
  connected: boolean;
  mode: ConnectionMode;
  endpoint: string;
  error: string | null;
}

export const PARAMETER_META: Record<
  ParameterKey,
  { label: string; unit: string; description: string }
> = {
  tds: {
    label: 'TDS',
    unit: 'ppm',
    description:
      'Total Dissolved Solids mengukur jumlah zat terlarut dalam air. Nilai rendah menandakan air bersih, nilai tinggi menandakan banyak mineral/garam terlarut.',
  },
  temperature: {
    label: 'Suhu',
    unit: '°C',
    description:
      'Suhu air memengaruhi kelarutan oksigen dan kehidupan akuatik. Rentang ideal untuk air konsumsi umumnya 20–28 °C.',
  },
  ph: {
    label: 'pH',
    unit: '',
    description:
      'pH menunjukkan tingkat keasaman atau kebasaan air. pH 7 netral; air konsumsi ideal antara 6.5–8.5.',
  },
  turbidity: {
    label: 'Turbidity',
    unit: 'NTU',
    description:
      'Turbiditas mengukur kekeruhan air akibat partikel tersuspensi. Semakin rendah semakin jernih; air layak konsumsi < 5 NTU.',
  },
};

export const DEFAULT_THRESHOLDS: Thresholds = {
  tds: { min: 0, max: 500, warningMin: 0, warningMax: 300 },
  temperature: { min: 15, max: 30, warningMin: 18, warningMax: 28 },
  ph: { min: 6.5, max: 8.5, warningMin: 7.0, warningMax: 8.0 },
  turbidity: { min: 0, max: 5, warningMin: 0, warningMax: 3 },
};
