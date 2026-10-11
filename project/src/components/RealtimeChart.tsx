import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ParameterKey, Reading, Thresholds } from '@/lib/types';
import { PARAMETER_META } from '@/lib/types';
import { getStatusForParam } from '@/lib/status';
import { StatusChip } from '@/components/StatusChip';

interface RealtimeChartProps {
  readings: Reading[];
  thresholds: Thresholds;
}

const PARAMS: ParameterKey[] = ['tds', 'temperature', 'ph', 'turbidity'];

const STATUS_LABELS = { good: 'Normal', warning: 'Sedang', bad: 'Buruk' };

// Warna grafik diatur lewat token tema di index.css
const AXIS_TICK = { fontSize: 12, fontFamily: '"Space Grotesk", sans-serif' };

export function RealtimeChart({ readings, thresholds }: RealtimeChartProps) {
  const [selected, setSelected] = useState<ParameterKey>('ph');
  const meta = PARAMETER_META[selected];

  const data = useMemo(() => {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    return readings
      .filter((r) => r.timestamp >= cutoff)
      .map((r) => ({
        time: new Date(r.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        value: Number(r[selected].toFixed(2)),
        timestamp: r.timestamp,
      }));
  }, [readings, selected]);

  const latest = readings.length ? readings[readings.length - 1][selected] : null;
  const status = latest !== null ? getStatusForParam(latest, selected, thresholds) : null;

  return (
    <div className="card p-4 animate-fade-in-up sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-headline-sm text-ink">Grafik Real-time (24 Jam)</h3>
          <p className="mt-2 text-body-sm text-muted">
            Riwayat {meta.label} {meta.unit && `(${meta.unit})`}
          </p>
        </div>
        <div className="flex flex-wrap border border-line" role="tablist" aria-label="Parameter grafik">
          {PARAMS.map((p) => (
            <button
              key={p}
              role="tab"
              aria-selected={selected === p}
              onClick={() => setSelected(p)}
              className={`h-9 border-r border-line px-4 font-display text-label-md transition-colors last:border-r-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                selected === p
                  ? 'bg-primary-10 text-primary'
                  : 'text-muted hover:bg-neutral/40 hover:text-ink'
              }`}
            >
              {PARAMETER_META[p].label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-2">
        <span className="font-display text-headline-lg tabular-nums text-ink">
          {latest !== null ? (selected === 'ph' ? latest.toFixed(2) : latest.toFixed(1)) : '--'}
        </span>
        <span className="font-display text-label-lg text-muted">{meta.unit}</span>
        <span className="ml-auto self-center">
          <StatusChip level={status}>{status ? STATUS_LABELS[status] : 'Menunggu'}</StatusChip>
        </span>
      </div>

      <div className="mt-4 h-72">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="time"
                tick={AXIS_TICK}
                axisLine
                tickLine={false}
                minTickGap={40}
              />
              <YAxis
                tick={AXIS_TICK}
                axisLine={false}
                tickLine={false}
                domain={['auto', 'auto']}
              />
              <Tooltip
                cursor={{ strokeWidth: 1 }}
                contentStyle={{
                  background: 'rgb(var(--color-surface))',
                  border: '1px solid rgb(var(--color-line))',
                  borderRadius: 0,
                  boxShadow: 'none',
                  fontSize: '14px',
                  color: 'rgb(var(--color-ink))',
                }}
                labelStyle={{ color: 'rgb(var(--color-muted))' }}
                itemStyle={{ color: 'rgb(var(--color-ink))' }}
                formatter={(v) => [`${v} ${meta.unit}`, meta.label]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="currentColor"
                strokeWidth={2}
                fill="currentColor"
                fillOpacity={0.08}
                activeDot={{ r: 4, strokeWidth: 2 }}
                animationDuration={300}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="grid h-full place-items-center border border-dashed border-line text-body-sm text-muted">
            Menunggu data...
          </div>
        )}
      </div>
    </div>
  );
}
