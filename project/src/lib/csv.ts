import type { Reading, ParameterKey } from './types';

function escapeCsv(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function exportReadingsToCsv(readings: Reading[]): void {
  const keys: ParameterKey[] = ['tds', 'temperature', 'ph', 'turbidity'];
  const header = ['Timestamp', 'Waktu', 'Nomor Kolam', 'TDS (ppm)', 'Suhu (°C)', 'pH', 'Turbidity (NTU)'];
  const rows = readings.map((r) => {
    const d = new Date(r.timestamp);
    return [
      String(r.timestamp),
      d.toLocaleString('id-ID'),
      r.nomorKolam ?? '',
      r.tds.toFixed(2),
      r.temperature.toFixed(2),
      r.ph.toFixed(2),
      r.turbidity.toFixed(2),
    ];
  });
  const csv = [header, ...rows].map((row) => row.map(escapeCsv).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `water-quality-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
