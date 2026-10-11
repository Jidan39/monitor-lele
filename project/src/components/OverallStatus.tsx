import { ShieldCheck, ShieldAlert, ShieldX, Shield } from 'lucide-react';
import type { Reading, Thresholds } from '@/lib/types';
import { getOverallStatus, STATUS_DOT, STATUS_LABEL, STATUS_TEXT } from '@/lib/status';

interface OverallStatusProps {
  latest: Reading | null;
  thresholds: Thresholds;
}

const ICONS = {
  good: ShieldCheck,
  warning: ShieldAlert,
  bad: ShieldX,
};

export function OverallStatus({ latest, thresholds }: OverallStatusProps) {
  const level = latest ? getOverallStatus(latest, thresholds) : null;
  const Icon = level ? ICONS[level] : Shield;

  return (
    <div className="card relative flex flex-wrap items-center gap-x-6 gap-y-4 overflow-hidden p-4 pl-6 animate-fade-in-up sm:p-6 sm:pl-8">
      <span
        className={`absolute inset-y-0 left-0 w-1 ${level ? STATUS_DOT[level] : 'bg-neutral'}`}
        aria-hidden
      />
      <div className={`icon-box h-14 w-14 ${level ? STATUS_TEXT[level] : 'text-muted'}`}>
        <Icon className="h-7 w-7" strokeWidth={1.5} />
      </div>
      <div className="min-w-0 flex-1 basis-60">
        <p className="eyebrow">Hasil Klasifikasi Model KNN</p>
        <h2 className="mt-1.5 font-display text-headline-sm text-ink sm:text-headline-md">
          {level ? STATUS_LABEL[level] : 'MENUNGGU'}
        </h2>
      </div>
      {latest && (
        <div className="border-line sm:border-l sm:pl-6">
          <p className="eyebrow">Update terakhir</p>
          <p className="mt-1.5 font-display text-label-lg tabular-nums text-ink">
            {new Date(latest.timestamp).toLocaleTimeString('id-ID')}
          </p>
        </div>
      )}
    </div>
  );
}
