import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';
import type { Reading, Thresholds } from '@/lib/types';
import { getOverallStatus, STATUS_LABEL } from '@/lib/status';

interface OverallStatusProps {
  latest: Reading | null;
  thresholds: Thresholds;
}

const STYLES = {
  good: {
    icon: ShieldCheck,
    text: 'text-emerald-400',
    bg: 'from-emerald-500/15 via-emerald-500/5 to-transparent',
    ring: 'ring-emerald-400/25',
    label: 'AMAN',
    desc: 'Semua parameter kualitas air berada dalam batas normal.',
  },
  warning: {
    icon: ShieldAlert,
    text: 'text-amber-400',
    bg: 'from-amber-500/15 via-amber-500/5 to-transparent',
    ring: 'ring-amber-400/25',
    label: 'WASPADA',
    desc: 'Satu atau lebih parameter mendekati atau melebihi batas aman.',
  },
  bad: {
    icon: ShieldX,
    text: 'text-rose-400',
    bg: 'from-rose-500/15 via-rose-500/5 to-transparent',
    ring: 'ring-rose-400/25',
    label: 'BAHAYA',
    desc: 'Satu atau lebih parameter berada di luar batas aman. Segera periksa sistem.',
  },
};

export function OverallStatus({ latest, thresholds }: OverallStatusProps) {
  const level = latest ? getOverallStatus(latest, thresholds) : 'good';
  const s = STYLES[level];
  const Icon = s.icon;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl glass-strong ring-1 ${s.ring} bg-gradient-to-r ${s.bg} p-5 animate-fade-in-up`}
    >
      <div className="flex items-center gap-4">
        <div className={`grid place-items-center w-14 h-14 rounded-2xl bg-white/5 ${s.text}`}>
          <Icon className="w-7 h-7" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className={`text-2xl font-extrabold tracking-tight ${s.text}`}>
              {latest ? s.label : 'MENUNGGU'}
            </h2>
            <span className="text-xs text-slate-500">Status Keseluruhan</span>
          </div>
          <p className="mt-0.5 text-sm text-slate-400 truncate">
            {latest ? s.desc : 'Menunggu data dari ESP32...'}
          </p>
        </div>
        {latest && (
          <div className="hidden sm:block text-right">
            <p className="text-[11px] text-slate-500">Update terakhir</p>
            <p className="text-sm font-medium text-slate-300 tabular-nums">
              {new Date(latest.timestamp).toLocaleTimeString('id-ID')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
