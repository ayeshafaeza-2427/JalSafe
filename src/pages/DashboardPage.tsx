import { Activity, ArrowRight, BatteryMedium, CheckCircle2, CircleAlert, Droplets, Gauge, Link as LinkIcon, LockKeyhole, ShieldCheck, SunMedium } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';
import {
  demoAlerts,
  demoDeviceStatus,
  demoInletReading,
  demoOutletReading,
  demoSafetyDecision,
  demoSafetySummary,
  demoTreatmentRecords,
  demoTreatmentStages,
} from '../lib/demo-data';

const shortcuts = [
  { label: 'Water monitoring', to: '/monitoring', icon: Droplets },
  { label: 'Treatment control', to: '/treatment', icon: ShieldCheck },
  { label: 'Safety alerts', to: '/alerts', icon: CircleAlert },
  { label: 'Treatment records', to: '/records', icon: LinkIcon },
];

export function DashboardPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">Operational overview</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">JalSafe</h1>
            <p className="mt-1 text-slate-600">Water Safety &amp; Purification Control</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Demo Device <span className="text-slate-300">•</span> Simulation Mode
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <MetricCard label="Overall safety" value="REJECTED" subtext="Output locked" tone="danger" icon={<LockKeyhole size={18} className="text-red-600" />} />
          <MetricCard label="System status" value="ATTENTION" subtext="Action required" tone="warning" icon={<CircleAlert size={18} className="text-amber-600" />} />
          <MetricCard label="Battery" value={`${demoDeviceStatus.health.batteryLevel}%`} subtext="Safe reserve" tone="safe" icon={<BatteryMedium size={18} className="text-emerald-600" />} />
          <MetricCard label="Solar" value="Charging" subtext={`${demoDeviceStatus.health.solarVoltage} V`} tone="safe" icon={<SunMedium size={18} className="text-emerald-600" />} />
          <MetricCard label="Current cycle" value={demoTreatmentRecords[0].id} subtext="Latest decision" tone="neutral" icon={<Activity size={18} className="text-slate-500" />} />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
          <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Current safety decision</p>
                <h2 className="mt-3 flex items-center gap-3 text-3xl font-bold text-red-700"><LockKeyhole size={30} />REJECTED</h2>
              </div>
              <StatusBadge tone="danger" label="OUTPUT LOCKED" />
            </div>
            <p className="mt-5 max-w-xl text-lg font-medium leading-7 text-slate-800">{demoSafetySummary}</p>
            <div className="mt-5 grid gap-3 border-t border-slate-100 pt-4 text-sm sm:grid-cols-3">
              <div><span className="block text-slate-500">Failed check</span><strong className="text-slate-900">Outlet turbidity</strong></div>
              <div><span className="block text-slate-500">Observed</span><strong className="text-slate-900">{demoSafetyDecision.failedValue} NTU</strong></div>
              <div><span className="block text-slate-500">Safe limit</span><strong className="text-slate-900">≤ {demoSafetyDecision.threshold} NTU</strong></div>
            </div>
            <div className="mt-5 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
              <LockKeyhole size={17} /> Simulated solenoid: LOCKED. No release or bypass action is available.
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Latest cycle</p>
                <h2 className="mt-2 text-xl font-bold text-slate-950">Treatment progress</h2>
              </div>
              <StatusBadge tone="danger" label={demoTreatmentRecords[0].id} />
            </div>
            <div className="mt-5 space-y-3">
              {demoTreatmentStages.map((stage) => (
                <div key={stage.name} className="flex items-center gap-3 text-sm">
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${stage.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {stage.status === 'COMPLETED' ? <CheckCircle2 size={15} /> : <CircleAlert size={15} />}
                  </div>
                  <span className="flex-1 font-medium text-slate-700">{stage.name}</span>
                  <span className={`text-xs font-semibold ${stage.status === 'COMPLETED' ? 'text-emerald-700' : 'text-red-700'}`}>{stage.status === 'COMPLETED' ? 'PASS' : 'BLOCKED'}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.15fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Quick sensor summary</p>
                <h2 className="mt-2 text-xl font-bold text-slate-950">Water quality snapshot</h2>
              </div>
              <Link to="/monitoring" className="text-sm font-semibold text-teal-700 hover:text-teal-900">Full monitoring <ArrowRight size={15} className="ml-1 inline" /></Link>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                ['Inlet pH', `${demoInletReading.ph}`, 'Normal'],
                ['Inlet TDS', `${demoInletReading.tds} mg/L`, 'Normal'],
                ['Inlet turbidity', `${demoInletReading.turbidity} NTU`, 'Normal'],
                ['Outlet pH', `${demoOutletReading.ph}`, 'Normal'],
                ['Outlet TDS', `${demoOutletReading.tds} mg/L`, 'Normal'],
                ['Outlet turbidity', `${demoOutletReading.turbidity} NTU`, 'CRITICAL'],
                ['Outlet flow', `${demoOutletReading.flowRate} L/h`, 'Valid'],
                ['UV health', `${demoDeviceStatus.health.uvHealth}%`, 'Operational'],
              ].map(([label, value, state]) => (
                <div key={label}>
                  <div className="text-xs text-slate-500">{label}</div>
                  <div className="mt-1 font-bold text-slate-900">{value}</div>
                  <div className={`mt-1 text-xs font-semibold ${state === 'CRITICAL' ? 'text-red-700' : 'text-slate-500'}`}>{state}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Recent safety events</p>
                <h2 className="mt-2 text-xl font-bold text-slate-950">What needs attention</h2>
              </div>
              <Link to="/alerts" className="text-sm font-semibold text-teal-700 hover:text-teal-900">All alerts <ArrowRight size={15} className="ml-1 inline" /></Link>
            </div>
            <div className="mt-4 space-y-3">
              {demoAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${alert.priority === 'CRITICAL' ? 'bg-red-500' : 'bg-amber-500'}`} />
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-2"><p className="font-semibold text-slate-800">{alert.title}</p><span className="whitespace-nowrap text-xs text-slate-400">{alert.time}</span></div>
                    <p className="mt-1 text-sm text-slate-600">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Shortcuts</p>
              <h2 className="mt-2 text-xl font-bold text-slate-950">Continue in JalSafe</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500"><Gauge size={16} /> Latest record: {demoTreatmentRecords[0].id}</div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {shortcuts.map(({ label, to, icon: Icon }) => (
              <Link key={to} to={to} className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800">
                <Icon size={18} />{label}<ArrowRight size={15} className="ml-auto" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
