import { useState, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Bell, ChevronRight, Droplets, Gauge, HeartPulse, LayoutDashboard, Menu, ScrollText, X } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Monitoring', to: '/monitoring', icon: Gauge },
  { label: 'Treatment', to: '/treatment', icon: Droplets },
  { label: 'Alerts', to: '/alerts', icon: Bell },
  { label: 'Records', to: '/records', icon: ScrollText },
  { label: 'Device Health', to: '/device-health', icon: HeartPulse },
];

export function Layout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f7f7] text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-[1480px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Open navigation" onClick={() => setMenuOpen(true)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden">
              <Menu size={22} />
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm"><Droplets size={21} /></div>
            <div><div className="text-lg font-bold tracking-tight">JalSafe</div><div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Water safety control</div></div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 font-semibold text-amber-800 sm:flex"><span className="h-2 w-2 rounded-full bg-amber-500" />Simulation mode</span>
            <span className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-600 sm:inline">Demo Device</span>
            <button type="button" aria-label="Notifications" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Bell size={19} /></button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1480px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {menuOpen ? <button type="button" aria-label="Close navigation overlay" className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" onClick={() => setMenuOpen(false)} /> : null}
        <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200 bg-white p-5 shadow-xl transition-transform lg:static lg:z-0 lg:block lg:w-64 lg:shrink-0 lg:rounded-2xl lg:border lg:shadow-sm ${menuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="mb-7 flex items-center justify-between lg:hidden"><span className="font-semibold">Navigation</span><button type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)}><X size={20} /></button></div>
          <div className="mb-6 rounded-xl bg-slate-900 p-4 text-white"><div className="text-xs uppercase tracking-[0.14em] text-slate-400">Active unit</div><div className="mt-2 font-semibold">Demo Device</div><div className="mt-1 text-xs text-slate-400">JAL-DEV-014 · Online</div></div>
          <nav className="space-y-1.5" aria-label="Primary navigation">
            {navItems.map(({ label, to, icon: Icon }) => (
              <NavLink key={to} to={to} onClick={() => setMenuOpen(false)} className={({ isActive }) => `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${isActive ? 'bg-teal-50 text-teal-800 ring-1 ring-teal-200' : 'text-slate-600 hover:bg-slate-100'}`}>
                <Icon size={18} /><span className="flex-1">{label}</span><ChevronRight size={15} className="opacity-40" />
              </NavLink>
            ))}
          </nav>
          <div className="mt-8 border-t border-slate-200 pt-5 text-xs leading-5 text-slate-500">Simulation data is isolated from production device and Supabase connections.</div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
