import { useState } from 'react';
import { Download, ChevronUp, ChevronDown } from 'lucide-react';
import type { ParameterKey, Reading, Thresholds } from '@/lib/types';
import { PARAMETER_META } from '@/lib/types';
import { getStatusForParam } from '@/lib/status';
import { exportReadingsToCsv } from '@/lib/csv';

interface HistoryTableProps {
  readings: Reading[];
  thresholds: Thresholds;
}

type SortDir = 'asc' | 'desc';

const COLUMNS: { key: ParameterKey; label: string }[] = [
  { key: 'tds', label: 'TDS' },
  { key: 'temperature', label: 'Suhu' },
  { key: 'ph', label: 'pH' },
  { key: 'turbidity', label: 'Turbidity' },
];

const STATUS_DOT: Record<string, string> = {
  good: 'bg-emerald-400',
  warning: 'bg-amber-400',
  bad: 'bg-rose-400',
};

export function HistoryTable({ readings, thresholds }: HistoryTableProps) {
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const sorted = [...readings].sort((a, b) =>
    sortDir === 'desc' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const rows = sorted.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  return (
    <div className="rounded-2xl glass-strong p-5 animate-fade-in-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-100">Riwayat Data</h3>
          <p className="text-xs text-slate-500">{readings.length} total data tercatat</p>
        </div>
        <button
          onClick={() => exportReadingsToCsv(sorted)}
          disabled={readings.length === 0}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/20 hover:bg-cyan-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b border-white/10">
              <th className="py-2.5 pr-4 font-medium">
                <button
                  onClick={() => setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))}
                  className="flex items-center gap-1 hover:text-slate-300"
                >
                  Waktu
                  {sortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                </button>
              </th>
              {COLUMNS.map((c) => (
                <th key={c.key} className="py-2.5 px-4 font-medium">
                  {c.label}
                  <span className="text-slate-600 ml-1">{PARAMETER_META[c.key].unit}</span>
                </th>
              ))}
              <th className="py-2.5 px-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-500">
                  Belum ada data. Hubungkan ke ESP32 untuk mulai merekam.
                </td>
              </tr>
            ) : (
              rows.map((r) => {
                const levels = COLUMNS.map((c) => getStatusForParam(r[c.key], c.key, thresholds));
                const overall = levels.includes('bad') ? 'bad' : levels.includes('warning') ? 'warning' : 'good';
                return (
                  <tr key={r.timestamp} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 pr-4 text-slate-300 tabular-nums">
                      {new Date(r.timestamp).toLocaleString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    {COLUMNS.map((c) => {
                      const st = getStatusForParam(r[c.key], c.key, thresholds);
                      const val = c.key === 'ph' ? r[c.key].toFixed(2) : r[c.key].toFixed(1);
                      return (
                        <td key={c.key} className="py-2.5 px-4">
                          <span className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[st]}`} />
                            <span className="tabular-nums text-slate-200">{val}</span>
                          </span>
                        </td>
                      );
                    })}
                    <td className="py-2.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          overall === 'good'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : overall === 'warning'
                              ? 'bg-amber-500/15 text-amber-400'
                              : 'bg-rose-500/15 text-rose-400'
                        }`}
                      >
                        {overall === 'good' ? 'Aman' : overall === 'warning' ? 'Waspada' : 'Bahaya'}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Halaman {currentPage + 1} dari {totalPages}
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
              className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
