import type { ParameterKey, StatusLevel } from '@/lib/types';
import { PARAMETER_META } from '@/lib/types';
import { getStatusForParam } from '@/lib/status';
import type { Thresholds } from '@/lib/types';
import { Droplets, Thermometer, FlaskConical, Waves } from 'lucide-react';
import { StatusChip } from '@/components/StatusChip';

const ICONS: Record<ParameterKey, typeof Droplets> = {
  tds: Droplets,
  temperature: Thermometer,
  ph: FlaskConical,
  turbidity: Waves,
};

const STATUS_LABELS: Record<StatusLevel, string> = {
  good: 'Normal',
  warning: 'Sedang',
  bad: 'Buruk',
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
  const hasData = lastUpdated !== null;
  const status = hasData ? getStatusForParam(value, param, thresholds) : null;

  const formatted =
    param === 'ph' ? value.toFixed(2) : param === 'turbidity' ? value.toFixed(1) : value.toFixed(0);

  return (
    <div className="flex flex-col p-4 animate-fade-in-up sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3 whitespace-nowrap">
          <div className="icon-box">
            <Icon className="h-5 w-5" strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-display text-label-lg text-ink">{meta.label}</p>
            <p className="eyebrow">{meta.unit || meta.unitLabel || 'pH units'}</p>
          </div>
        </div>
        {!meta.rangeOnly && (
          <StatusChip level={status}>{status ? STATUS_LABELS[status] : 'Menunggu'}</StatusChip>
        )}
      </div>

      <div className="mt-10 flex items-baseline gap-2">
        <span
          className={`font-display text-headline-lg tabular-nums sm:text-headline-display ${
            hasData ? 'text-ink' : 'text-muted/50'
          }`}
        >
          {hasData ? formatted : '--'}
        </span>
        <span className="font-display text-label-lg text-muted">{meta.unit}</span>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-neutral pt-4 text-body-sm text-muted">
        <span>
          {meta.rangeOnly ? 'Rentang nilai' : 'Rentang aman'}: {thresholds[param].min}–{thresholds[param].max}
          {meta.unit && ` ${meta.unit}`}
        </span>
        {lastUpdated && (
          <span className="tabular-nums">{new Date(lastUpdated).toLocaleTimeString('id-ID')}</span>
        )}
      </div>
    </div>
  );
}
