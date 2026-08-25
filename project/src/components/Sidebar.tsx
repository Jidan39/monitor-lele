import { LayoutDashboard, Settings as SettingsIcon, Droplets, Info } from 'lucide-react';

export type PageId = 'dashboard' | 'settings' | 'about';

interface SidebarProps {
  current: PageId;
  onNavigate: (page: PageId) => void;
  connected: boolean;
  mode: string;
}

const NAV_ITEMS: { id: PageId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
  { id: 'about', label: 'Tentang', icon: Info },
];

export function Sidebar({ current, onNavigate, connected, mode }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col gap-2 p-4 border-r border-white/10 bg-slate-950/40 backdrop-blur-xl">
        <BrandHeader />
        <nav className="mt-6 flex flex-col gap-1">
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
        <div className="mt-auto">
          <ConnectionPill connected={connected} mode={mode} />
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="grid place-items-center w-9 h-9 rounded-xl bg-cyan-500/15 text-cyan-400">
            <Droplets className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-100">AquaMonitor</span>
        </div>
        <nav className="flex gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`grid place-items-center w-10 h-10 rounded-lg transition-colors ${
                current === item.id
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
              aria-label={item.label}
            >
              <item.icon className="w-5 h-5" />
            </button>
          ))}
        </nav>
      </header>
    </>
  );
}

function BrandHeader() {
  return (
    <div className="flex items-center gap-3 px-2 py-2">
      <div className="grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400/30 to-blue-500/20 text-cyan-400 ring-1 ring-cyan-400/20">
        <Droplets className="w-5 h-5" />
      </div>
      <div>
        <h1 className="text-lg font-bold tracking-tight text-slate-100">AquaMonitor</h1>
        <p className="text-[11px] text-slate-500">ESP32 Water Quality</p>
      </div>
    </div>
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
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active
          ? 'bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/20'
          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );
}

function ConnectionPill({ connected, mode }: { connected: boolean; mode: string }) {
  return (
    <div className="glass rounded-xl px-3 py-2.5 flex items-center gap-2.5">
      <span
        className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-emerald-400 pulse-ring' : 'bg-slate-500'}`}
      />
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-300">
          {connected ? 'Terhubung' : 'Terputus'}
        </p>
        <p className="text-[10px] text-slate-500 uppercase tracking-wide truncate">{mode}</p>
      </div>
    </div>
  );
}
