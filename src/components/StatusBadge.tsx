type StatusBadgeProps = {
  tone: 'safe' | 'warning' | 'danger' | 'neutral';
  label: string;
};

const toneStyles: Record<StatusBadgeProps['tone'], string> = {
  safe: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  warning: 'bg-amber-100 text-amber-800 border-amber-200',
  danger: 'bg-red-100 text-red-800 border-red-200',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
};

export function StatusBadge({ tone, label }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${toneStyles[tone]}`}>
      {label}
    </span>
  );
}
