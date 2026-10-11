import { useState } from 'react';
import { Download, ChevronUp, ChevronDown } from 'lucide-react';
import type { ParameterKey, Reading, Thresholds } from '@/lib/types';
import { PARAMETER_META } from '@/lib/types';
import { getStatusForParam, STATUS_DOT } from '@/lib/status';
import { exportReadingsToCsv } from '@/lib/csv';
import { StatusChip } from '@/components/StatusChip';

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
    <div className="card animate-fade-in-up">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-6">
        <div>
          <h3 className="font-display text-headline-sm text-ink">Riwayat Data</h3>
          <p className="mt-2 text-body-sm text-muted">{readings.length} total data tercatat</p>
        </div>
        <button
          onClick={() => exportReadingsToCsv(sorted)}
          disabled={readings.length === 0}
          className="btn btn-secondary"
        >
          <Download className="h-4 w-4" strokeWidth={1.5} />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto border-t border-line">
        <table className="w-full min-w-[640px] text-body-sm">
          <thead>
            <tr className="eyebrow border-b border-line text-left">
              <th className="px-4 py-3 font-normal sm:px-6">
                <button
                  onClick={() => setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))}
                  className="flex items-center gap-1.5 uppercase tracking-[inherit] transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  Waktu
                  {sortDir === 'desc' ? (
                    <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.5} />
                  ) : (
                    <ChevronUp className="h-3.5 w-3.5" strokeWidth={1.5} />
                  )}
                </button>
              </th>
              {COLUMNS.map((c) => (
                <th key={c.key} className="px-4 py-3 font-normal">
                  {c.label}
                  <span className="ml-1.5 normal-case text-muted/60">{PARAMETER_META[c.key].unit}</span>
                </th>
              ))}
              <th className="px-4 py-3 font-normal sm:pr-6">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center text-body-md text-muted">
                  Belum ada data. Hubungkan ke ESP32 untuk mulai merekam.
                </td>
              </tr>
            ) : (
              rows.map((r) => {
                const levels = COLUMNS.map((c) => getStatusForParam(r[c.key], c.key, thresholds));
                const overall = levels.includes('bad') ? 'bad' : levels.includes('warning') ? 'warning' : 'good';
                return (
                  <tr
                    key={r.timestamp}
                    className="border-b border-neutral transition-colors last:border-b-0 hover:bg-neutral/30"
                  >
                    <td className="whitespace-nowrap px-4 py-3 tabular-nums text-muted sm:px-6">
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
                        <td key={c.key} className="px-4 py-3">
                          <span className="flex items-center gap-2">
                            <span className={`h-1.5 w-1.5 ${STATUS_DOT[st]}`} />
                            <span className="font-display tabular-nums text-ink">{val}</span>
                          </span>
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 sm:pr-6">
                      <StatusChip level={overall}>
                        {overall === 'good' ? 'Aman' : overall === 'warning' ? 'Waspada' : 'Bahaya'}
                      </StatusChip>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line p-4 sm:px-6">
          <span className="font-display text-label-md tabular-nums text-muted">
            Halaman {currentPage + 1} dari {totalPages}
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="btn btn-secondary btn-sm"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
              className="btn btn-secondary btn-sm"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
