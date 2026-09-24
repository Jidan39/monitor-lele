import { ParameterCard } from '@/components/ParameterCard';
import { OverallStatus } from '@/components/OverallStatus';
import { RealtimeChart } from '@/components/RealtimeChart';
import { HistoryTable } from '@/components/HistoryTable';
import type { ConnectionStatus, ParameterKey, Reading, Thresholds } from '@/lib/types';
import { RefreshCw, Radio } from 'lucide-react';

interface DashboardPageProps {
  readings: Reading[];
  latest: Reading | null;
  thresholds: Thresholds;
  status: ConnectionStatus;
  onReconnect: () => void;
}

const PARAMS: ParameterKey[] = ['tds', 'temperature', 'ph', 'turbidity'];

export function DashboardPage({ readings, latest: latestLive, thresholds, status, onReconnect }: DashboardPageProps) {
  const latest = latestLive ?? (readings.length ? readings[readings.length - 1] : null);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Dashboard Monitoring</h1>
          <p className="text-sm text-slate-500">Pantau kualitas air secara real-time</p>
        </div>
        <div className="flex items-center gap-2.5">
          <ConnectionBadge status={status} />
          <button
            onClick={onReconnect}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium bg-white/5 text-slate-300 hover:bg-white/10 ring-1 ring-white/10 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Reconnect</span>
          </button>
        </div>
      </div>

      {/* Overall status */}
      <OverallStatus latest={latest} thresholds={thresholds} />

      {/* Parameter cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {PARAMS.map((p) => (
          <ParameterCard
            key={p}
            param={p}
            value={latest ? latest[p] : 0}
            thresholds={thresholds}
            lastUpdated={latest ? latest.timestamp : null}
          />
        ))}
      </div>

      {/* Chart */}
      <RealtimeChart readings={readings} thresholds={thresholds} />

      {/* History table */}
      <HistoryTable readings={readings} thresholds={thresholds} />
    </div>
  );
}

function ConnectionBadge({ status }: { status: ConnectionStatus }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg glass text-xs">
      <Radio className={`w-4 h-4 ${status.connected ? 'text-emerald-400' : 'text-slate-500'}`} />
      <span className="text-slate-400">
        {status.connected ? 'Terhubung' : status.error ? 'Koneksi gagal' : 'Menghubungkan...'}
      </span>
      <span className="hidden sm:inline text-slate-600">·</span>
      <span className="hidden sm:inline text-slate-500 uppercase tracking-wide">{status.mode}</span>
    </div>
  );
}
