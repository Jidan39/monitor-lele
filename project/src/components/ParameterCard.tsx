import type { ParameterKey, StatusLevel } from '@/lib/types';
import { PARAMETER_META } from '@/lib/types';
import { getStatusForParam } from '@/lib/status';
import type { Thresholds } from '@/lib/types';
import { Droplets, Thermometer, FlaskConical, Waves } from 'lucide-react';

const ICONS: Record<ParameterKey, typeof Droplets> = {
  tds: Droplets,
  temperature: Thermometer,
  ph: FlaskConical,
  turbidity: Waves,
};

const STATUS_STYLES: Record<StatusLevel, { ring: string; text: string; bg: string; dot: string; label: string }> = {
  good: {
    ring: 'ring-emerald-400/30',
    text: 'text-emerald-400',
    bg: 'from-emerald-500/10 to-emerald-500/[0.02]',
    dot: 'bg-emerald-400',
    label: 'Normal',
  },
  warning: {
    ring: 'ring-amber-400/30',
    text: 'text-amber-400',
    bg: 'from-amber-500/10 to-amber-500/[0.02]',
    dot: 'bg-amber-400',
    label: 'Sedang',
  },
  bad: {
    ring: 'ring-rose-400/30',
    text: 'text-rose-400',
    bg: 'from-rose-500/10 to-rose-500/[0.02]',
    dot: 'bg-rose-400',
    label: 'Buruk',
  },
};

interface ParameterCardProps {
  param: ParameterKey;
  value: number;
  thresholds: Thresholds;
  lastUpdated: number | null;
}

export function ParameterCard({ param, value, thresholds, lastUpdated }: ParameterCardProps) {
  const meta = PARAMETER_META[param];
  const Icon = ICONS[param];
  const status = getStatusForParam(value, param, thresholds);
  const styles = STATUS_STYLES[status];

  const formatted =
    param === 'ph' ? value.toFixed(2) : param === 'turbidity' ? value.toFixed(1) : value.toFixed(0);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl glass-strong ring-1 ${styles.ring} bg-gradient-to-br ${styles.bg} p-5 transition-all duration-500 hover:scale-[1.02] animate-fade-in-up`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`grid place-items-center w-10 h-10 rounded-xl bg-white/5 ${styles.text}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200">{meta.label}</p>
            <p className="text-[11px] text-slate-500">{meta.unit || 'pH units'}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1">
          <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
          <span className={`text-[11px] font-medium ${styles.text}`}>{styles.label}</span>
        </div>
      </div>

      <div className="mt-6 flex items-end gap-1.5">
        <span className={`text-5xl font-extrabold tracking-tight ${styles.text} tabular-nums`}>
          {formatted}
        </span>
        <span className="mb-2 text-base font-medium text-slate-400">{meta.unit}</span>
      </div>

      <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
        <span>
          Rentang aman: {thresholds[param].min}–{thresholds[param].max}
          {meta.unit && ` ${meta.unit}`}
        </span>
        {lastUpdated && (
          <span>{new Date(lastUpdated).toLocaleTimeString('id-ID')}</span>
        )}
      </div>
    </div>
  );
}
