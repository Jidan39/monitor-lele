import { useCallback, useMemo, useState } from 'react';
import { Navbar, type PageId } from '@/components/Navbar';
import { DashboardPage } from '@/pages/DashboardPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { AboutPage } from '@/pages/AboutPage';
import { useWaterData } from '@/hooks/useWaterData';
import { useTheme } from '@/hooks/useTheme';
import { loadSettings, saveSettings, DEFAULT_SETTINGS } from '@/lib/settings';
import type { Settings } from '@/lib/types';

function App() {
  const [page, setPage] = useState<PageId>('dashboard');
  const [settings, setSettings] = useState<Settings>(() => loadSettings());

  const { theme, toggleTheme } = useTheme();

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
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      <Navbar
        current={page}
        onNavigate={setPage}
        connected={status.connected}
        hasError={Boolean(status.error)}
        onReconnect={reconnect}
        mode={modeLabel}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="relative min-w-0 flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {page === 'dashboard' && (
            <DashboardPage
              readings={readings}
              latest={latest}
              thresholds={settings.thresholds}
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
