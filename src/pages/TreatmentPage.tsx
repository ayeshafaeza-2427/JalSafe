import { useState } from 'react';
import { CheckCircle2, CircleAlert, Clock3, LockKeyhole, Play, ShieldCheck } from 'lucide-react';
import { demoSafetyDecision, demoSafetySummary, demoTreatmentStages } from '../lib/demo-data';
import { Layout } from '../components/Layout';
import { StatusBadge } from '../components/StatusBadge';

export function TreatmentPage() {
  const [cycleState, setCycleState] = useState<'READY' | 'TREATING' | 'VERIFYING' | 'REJECTED'>('READY');

  return (
    <Layout>
      <div className="space-y-6">
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">Safety-gated lifecycle</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Treatment control</h1><p className="mt-1 text-slate-600">A software simulation of the JalSafe control lifecycle.</p></div>
          <button type="button" onClick={() => { setCycleState('TREATING'); window.setTimeout(() => setCycleState('VERIFYING'), 1200); window.setTimeout(() => setCycleState('REJECTED'), 2400); }} disabled={cycleState === 'TREATING' || cycleState === 'VERIFYING'} className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 disabled:cursor-wait disabled:opacity-60"><Play size={17} />Run Demo Cycle</button>
        </section>
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"><Clock3 size={18} /><span>Simulation only. A demo cycle evaluates the same configured readings and cannot bypass the safety gate.</span>
        </div>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Cycle CYC-1028</p><h2 className="mt-2 text-xl font-bold">Treatment pipeline</h2></div><StatusBadge tone={cycleState === 'REJECTED' || cycleState === 'READY' ? 'danger' : 'warning'} label={cycleState === 'READY' ? 'REJECTED / LOCKED' : cycleState} /></div>
          <div className="mt-8 grid gap-4 md:grid-cols-7">{demoTreatmentStages.map((stage, index) => { const isActive = cycleState === 'TREATING' && index < 4; const isVerifying = cycleState === 'VERIFYING' && index === 4; const failed = index >= 4; return <div key={stage.name} className="relative"><div className={`flex h-11 w-11 items-center justify-center rounded-full border-4 border-white shadow-sm ${failed ? 'bg-red-100 text-red-700' : isActive || isVerifying ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{failed ? <CircleAlert size={18} /> : isActive || isVerifying ? <Clock3 size={18} /> : <CheckCircle2 size={18} />}</div><h3 className="mt-3 text-sm font-bold text-slate-800">{stage.name}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{stage.explanation}</p><p className={`mt-2 text-xs font-semibold ${failed ? 'text-red-700' : 'text-emerald-700'}`}>{failed ? 'FAILED' : isActive || isVerifying ? 'IN PROGRESS' : 'COMPLETED'}</p>{index < demoTreatmentStages.length - 1 ? <div className="absolute left-11 top-5 hidden h-px w-[calc(100%-2rem)] bg-slate-200 md:block" /> : null}</div>; })}</div>
        </section>
        <section className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6"><div className="flex items-center gap-3 text-red-800"><LockKeyhole size={25} /><h2 className="text-2xl font-bold">OUTPUT LOCKED</h2></div><p className="mt-3 font-medium text-red-900">Water cannot be released because outlet verification failed.</p><p className="mt-4 text-sm leading-6 text-red-800">{demoSafetySummary}</p><div className="mt-5 rounded-xl border border-red-200 bg-white/70 p-4 text-sm"><div className="font-semibold text-red-900">Decision detail</div><div className="mt-2 text-red-800">{demoSafetyDecision.failedParameter}: {demoSafetyDecision.failedValue} NTU (limit ≤ {demoSafetyDecision.threshold} NTU)</div><div className="mt-2 flex items-center gap-2 font-semibold text-red-900"><ShieldCheck size={16} />Simulated Solenoid: LOCKED</div></div></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-lg font-bold">Lifecycle state</h2><div className="mt-4 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-slate-50 p-4"><div className="text-xs uppercase tracking-[0.12em] text-slate-500">Before cycle</div><div className="mt-2 font-bold">READY</div><p className="mt-1 text-xs text-slate-500">Waiting for a simulated run.</p></div><div className="rounded-xl bg-amber-50 p-4"><div className="text-xs uppercase tracking-[0.12em] text-amber-700">During cycle</div><div className="mt-2 font-bold text-amber-800">TREATING → VERIFYING</div><p className="mt-1 text-xs text-amber-700">Stages advance automatically.</p></div><div className="rounded-xl bg-red-50 p-4"><div className="text-xs uppercase tracking-[0.12em] text-red-700">Safety result</div><div className="mt-2 font-bold text-red-800">REJECTED / LOCKED</div><p className="mt-1 text-xs text-red-700">Unsafe output never releases.</p></div></div></div>
        </section>
      </div>
    </Layout>
  );
}
