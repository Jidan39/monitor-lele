import { ParameterCard } from '@/components/ParameterCard';
import { OverallStatus } from '@/components/OverallStatus';
import { RealtimeChart } from '@/components/RealtimeChart';
import { HistoryTable } from '@/components/HistoryTable';
import { PageHeader } from '@/components/PageHeader';
import type { ParameterKey, Reading, Thresholds } from '@/lib/types';

interface DashboardPageProps {
  readings: Reading[];
  latest: Reading | null;
  thresholds: Thresholds;
}

const PARAMS: ParameterKey[] = ['tds', 'temperature', 'ph', 'turbidity'];

export function DashboardPage({ readings, latest: latestLive, thresholds }: DashboardPageProps) {
  const latest = latestLive ?? (readings.length ? readings[readings.length - 1] : null);

  return (
    <div className="space-y-6 lg:space-y-10">
      {/* Header */}
      <PageHeader
        title="Dashboard Monitoring Kualitas Air Kolam Budidaya Benih Lele"
        desc="Pantau kualitas air secara real-time"
        image="/lele.webp"
      />

      {/* Overall status */}
      <OverallStatus latest={latest} thresholds={thresholds} />

      {/* Parameter cards */}
      <div className="cell-grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4">
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
