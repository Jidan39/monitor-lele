import type { ParameterKey, StatusLevel, Thresholds, Reading } from './types';

export function getStatus(value: number, t: { min: number; max: number; warningMin: number; warningMax: number }): StatusLevel {
  if (value < t.min || value > t.max) return 'bad';
  if (value < t.warningMin || value > t.warningMax) return 'warning';
  return 'good';
}

export function getStatusForParam(value: number, key: ParameterKey, thresholds: Thresholds): StatusLevel {
  return getStatus(value, thresholds[key]);
}

export function getOverallStatus(reading: Reading, thresholds: Thresholds): StatusLevel {
  const keys: ParameterKey[] = ['tds', 'temperature', 'ph', 'turbidity'];
  const levels = keys.map((k) => getStatus(reading[k], thresholds[k]));
  if (levels.includes('bad')) return 'bad';
  if (levels.includes('warning')) return 'warning';
  return 'good';
}

export const STATUS_LABEL: Record<StatusLevel, string> = {
  good: 'AMAN',
  warning: 'WASPADA',
  bad: 'BAHAYA',
};

export const STATUS_COLOR: Record<StatusLevel, string> = {
  good: '#10b981',
  warning: '#f59e0b',
  bad: '#ef4444',
};
