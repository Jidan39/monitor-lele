import { useCallback, useMemo, useState } from 'react';
import { Sidebar, type PageId } from '@/components/Sidebar';
import { DashboardPage } from '@/pages/DashboardPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { AboutPage } from '@/pages/AboutPage';
import { useWaterData } from '@/hooks/useWaterData';
import { loadSettings, saveSettings, DEFAULT_SETTINGS } from '@/lib/settings';
import type { Settings } from '@/lib/types';

function App() {
  const [page, setPage] = useState<PageId>('dashboard');
  const [settings, setSettings] = useState<Settings>(() => loadSettings());

  const { readings, latest, status, reconnect } = useWaterData(settings);

  const handleSaveSettings = useCallback((next: Settings) => {
    setSettings(next);
    saveSettings(next);
  }, []);

  const handleResetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
  }, []);

  const modeLabel = useMemo(() => {
    const labels: Record<string, string> = {
      demo: 'Demo',
      websocket: 'WebSocket',
      mqtt: 'MQTT',
      rest: 'REST API',
      firebase: 'Firebase',
    };
    return labels[settings.connectionMode] ?? settings.connectionMode;
  }, [settings.connectionMode]);

  return (
    <div className="flex min-h-screen bg-[#060b14] text-slate-200">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-teal-500/5 blur-[100px]" />
      </div>

      <Sidebar
        current={page}
        onNavigate={setPage}
        connected={status.connected}
        mode={modeLabel}
      />

      <main className="relative flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {page === 'dashboard' && (
            <DashboardPage
              readings={readings}
              latest={latest}
              thresholds={settings.thresholds}
              status={status}
              onReconnect={reconnect}
            />
          )}
          {page === 'settings' && (
            <SettingsPage settings={settings} onSave={handleSaveSettings} />
          )}
          {page === 'about' && <AboutPage />}
        </div>
      </main>
    </div>
  );
}

export default App;
