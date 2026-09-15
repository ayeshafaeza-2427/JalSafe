import { useMemo, useState } from 'react';
import { CheckCircle2, CircleAlert, LockKeyhole, Play, ShieldCheck } from 'lucide-react';
import { Layout } from '../components/Layout';
import { StatusBadge } from '../components/StatusBadge';
import { demoDeviceStatus, demoInletReading, demoOutletReading } from '../lib/demo-data';
import { runTreatmentController } from '../lib/treatment-controller';

const lifecycleLabels = [
  'Source Check',
  'Filtration',
  'UF',
  'UV',
  'Outlet Verification',
  'Safety Decision',
  'Release / Reject',
];

export function TreatmentPage() {
  const [safeSimulation, setSafeSimulation] = useState(false);
  const outlet = useMemo(
    () => (safeSimulation ? { ...demoOutletReading, turbidity: 0.4 } : demoOutletReading),
    [safeSimulation],
  );

  const result = useMemo(() => runTreatmentController({
    inlet: demoInletReading,
    outlet,
    health: demoDeviceStatus.health,
    connectivity: demoDeviceStatus.health.sensorConnectivity,
    uvFlowInterlockOk: true,
    recordWritable: true,
  }), [outlet]);

  const rejected = !result.releaseAllowed;
  const outletFailure = result.decision.failedParameter?.startsWith('outlet.') === true;
  const preTreatmentFailure = rejected && !outletFailure;
  const stageCompleted = [
    true,
    !preTreatmentFailure,
    !preTreatmentFailure,
    !preTreatmentFailure,
    result.decision.passed || outletFailure,
    rejected || result.decision.passed,
    rejected || result.decision.passed,
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">Safety-gated lifecycle</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Treatment control</h1>
            <p className="mt-1 text-slate-600">Every release decision is evaluated by the deterministic safety engine.</p>
          </div>
          <button type="button" onClick={() => setSafeSimulation((value) => !value)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-800">
            <Play size={17} /> {safeSimulation ? 'Show unsafe outlet' : 'Simulate safe outlet'}
          </button>
        </section>

        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <ShieldCheck size={18} className="mt-0.5 shrink-0" />
          <span><strong>Simulation only.</strong> The button changes simulated sensor input; it does not bypass the safety engine or directly unlock the solenoid.</span>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Cycle CYC-1028</p><h2 className="mt-2 text-xl font-bold">Source → Treatment → Verification → Decision</h2></div>
            <StatusBadge tone={rejected ? 'danger' : 'safe'} label={rejected ? 'REJECTED / LOCKED' : 'VERIFIED / RELEASED'} />
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-7">
            {lifecycleLabels.map((label, index) => {
              const complete = stageCompleted[index];
              const failedStage = rejected && ((outletFailure && index >= 4) || (preTreatmentFailure && index === 1));
              return (
                <div key={label} className="relative">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-full border-4 border-white shadow-sm ${failedStage ? 'bg-red-100 text-red-700' : complete ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                    {failedStage ? <CircleAlert size={18} /> : complete ? <CheckCircle2 size={18} /> : <span className="text-xs font-bold">{index + 1}</span>}
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-slate-800">{label}</h3>
                  <p className={`mt-2 text-xs font-semibold ${failedStage ? 'text-red-700' : complete ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {failedStage ? 'BLOCKED' : complete ? 'COMPLETED' : 'WAITING'}
                  </p>
                  {index < lifecycleLabels.length - 1 ? <div className="absolute left-11 top-5 hidden h-px w-[calc(100%-2rem)] bg-slate-200 md:block" /> : null}
                </div>
              );
            })}
          </div>
        </section>

        <section className={`rounded-2xl border p-6 ${rejected ? 'border-red-200 bg-red-50' : 'border-emerald-200 bg-emerald-50'}`}>
          <div className={`flex items-center gap-3 ${rejected ? 'text-red-800' : 'text-emerald-800'}`}>
            {rejected ? <LockKeyhole size={25} /> : <CheckCircle2 size={25} />}
            <h2 className="text-2xl font-bold">{result.solenoid === 'LOCKED' ? 'OUTPUT LOCKED' : 'OUTPUT RELEASED'}</h2>
          </div>
          <p className={`mt-3 font-medium ${rejected ? 'text-red-900' : 'text-emerald-900'}`}>
            {result.decision.rejectionReason ?? 'Outlet verification passed for the configured parameters.'}
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-white/70 p-4"><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Safety state</div><div className="mt-2 font-bold">{result.decision.state}</div></div>
            <div className="rounded-xl bg-white/70 p-4"><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Decision code</div><div className="mt-2 font-bold">{result.decision.rejectionCode ?? 'NONE'}</div></div>
            <div className="rounded-xl bg-white/70 p-4"><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Solenoid</div><div className="mt-2 font-bold">{result.solenoid}</div></div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
