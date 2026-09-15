import type { ReactNode } from 'react';

type MetricCardProps = {
  label: string;
  value: string;
  subtext?: string;
  tone?: 'safe' | 'warning' | 'danger' | 'neutral';
  icon?: ReactNode;
};

const toneStyles: Record<NonNullable<MetricCardProps['tone']>, string> = {
  safe: 'border-emerald-200 bg-emerald-50',
  warning: 'border-amber-200 bg-amber-50',
  danger: 'border-red-200 bg-red-50',
  neutral: 'border-slate-200 bg-white',
};

export function MetricCard({ label, value, subtext, tone = 'neutral', icon }: MetricCardProps) {
  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${toneStyles[tone]}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">{label}</span>
        {icon}
      </div>
      <div className="mt-4 text-2xl font-bold text-slate-900">{value}</div>
      {subtext ? <div className="mt-1 text-xs text-slate-600">{subtext}</div> : null}
    </div>
  );
}
