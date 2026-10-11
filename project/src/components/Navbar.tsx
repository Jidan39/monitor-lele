import { LayoutDashboard, Settings as SettingsIcon, Info, Moon, Sun, RefreshCw } from 'lucide-react';
import type { Theme } from '@/hooks/useTheme';

export type PageId = 'dashboard' | 'settings' | 'about';

interface NavbarProps {
  current: PageId;
  onNavigate: (page: PageId) => void;
  connected: boolean;
  hasError: boolean;
  onReconnect: () => void;
  mode: string;
  theme: Theme;
  onToggleTheme: () => void;
}

const NAV_ITEMS: { id: PageId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
  { id: 'about', label: 'Tentang', icon: Info },
];

export function Navbar({
  current,
  onNavigate,
  connected,
  hasError,
  onReconnect,
  mode,
  theme,
  onToggleTheme,
}: NavbarProps) {
  const ThemeIcon = theme === 'dark' ? Sun : Moon;
  const themeLabel = theme === 'dark' ? 'Mode terang' : 'Mode gelap';

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-stretch gap-2 px-4 sm:px-6 lg:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <ConnectionStatus connected={connected} hasError={hasError} mode={mode} />
          <button
            onClick={onReconnect}
            className="flex h-10 shrink-0 items-center gap-2.5 border border-line px-2.5 font-display text-label-md text-ink transition-colors hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:px-4"
            aria-label="Reconnect"
          >
            <RefreshCw className="h-4 w-4" strokeWidth={1.5} />
            <span className="hidden lg:inline">Reconnect</span>
          </button>
        </div>

        <nav className="flex items-stretch gap-1.5" aria-label="Navigasi utama">
          {NAV_ITEMS.map((item) => (
            <NavButton
              key={item.id}
              active={current === item.id}
              onClick={() => onNavigate(item.id)}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </nav>

        <div className="flex items-center justify-end">
          <button
            onClick={onToggleTheme}
            className="flex h-10 items-center gap-2.5 border border-line px-2.5 font-display text-label-md text-ink transition-colors hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:px-4"
            aria-label={themeLabel}
          >
            <ThemeIcon className="h-5 w-5" strokeWidth={1.5} />
            <span className="hidden lg:inline">{themeLabel}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function NavButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof LayoutDashboard;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      className={`-mb-px flex items-center gap-2.5 border-b-2 px-3 font-display text-label-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary sm:px-4 ${
        active
          ? 'border-primary text-primary'
          : 'border-transparent text-muted hover:border-line hover:text-ink'
      }`}
    >
      <Icon className="h-5 w-5" strokeWidth={1.5} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function ConnectionStatus({
  connected,
  hasError,
  mode,
}: {
  connected: boolean;
  hasError: boolean;
  mode: string;
}) {
  const label = connected ? 'Terhubung' : hasError ? 'Koneksi gagal' : 'Terputus';
  const dot = connected ? 'bg-ok' : hasError ? 'bg-danger' : 'bg-muted/50';
  return (
    <div className="flex min-w-0 items-center gap-2.5" title={`${label} · ${mode}`}>
      <span className={`h-2 w-2 shrink-0 ${dot}`} />
      <span className="hidden whitespace-nowrap font-display text-label-md text-ink md:inline">{label}</span>
      <span className="eyebrow hidden truncate border-l border-line pl-2.5 lg:inline">{mode}</span>
    </div>
  );
}
