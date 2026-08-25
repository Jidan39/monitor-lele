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
import { getStatusForParam, STATUS_COLOR } from '@/lib/status';

interface RealtimeChartProps {
  readings: Reading[];
  thresholds: Thresholds;
}

const PARAMS: ParameterKey[] = ['tds', 'temperature', 'ph', 'turbidity'];

export function RealtimeChart({ readings, thresholds }: RealtimeChartProps) {
  const [selected, setSelected] = useState<ParameterKey>('tds');
  const meta = PARAMETER_META[selected];
  const color = STATUS_COLOR[getStatusForParam(
    readings.length ? readings[readings.length - 1][selected] : 0,
    selected,
    thresholds
  )];

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

  return (
    <div className="rounded-2xl glass-strong p-5 animate-fade-in-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-100">Grafik Real-time (24 Jam)</h3>
          <p className="text-xs text-slate-500">
            Riwayat {meta.label} {meta.unit && `(${meta.unit})`}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PARAMS.map((p) => (
            <button
              key={p}
              onClick={() => setSelected(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selected === p
                  ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {PARAMETER_META[p].label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold tabular-nums text-slate-100">
          {latest !== null ? (selected === 'ph' ? latest.toFixed(2) : latest.toFixed(1)) : '--'}
        </span>
        <span className="text-sm text-slate-500">{meta.unit}</span>
      </div>

      <div className="mt-4 h-72">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis
                dataKey="time"
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={{ stroke: 'rgba(148,163,184,0.1)' }}
                tickLine={false}
                minTickGap={40}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={{ stroke: 'rgba(148,163,184,0.1)' }}
                tickLine={false}
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(15,23,42,0.95)',
                  border: '1px solid rgba(148,163,184,0.15)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#e2e8f0',
                }}
                labelStyle={{ color: '#94a3b8' }}
                formatter={(v) => [`${v} ${meta.unit}`, meta.label]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill="url(#chartGradient)"
                animationDuration={300}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full grid place-items-center text-sm text-slate-500">
            Menunggu data...
          </div>
        )}
      </div>
    </div>
  );
}
