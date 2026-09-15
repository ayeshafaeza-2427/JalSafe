import { demoAlerts, demoSafetySummary, demoTreatmentRecords, demoTreatmentStages } from '../lib/demo-data';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';
import { Layout } from '../components/Layout';

export function DashboardPage() {
  return (
    <Layout>
      <main>
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">Operational overview</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">JalSafe</h1>
                <p className="mt-1 text-slate-600">Water Safety &amp; Purification Control</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="h-2 w-2 rounded-full bg-amber-500" />Demo Device <span className="text-slate-300">•</span> Simulation Mode
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <MetricCard label="Overall safety" value="REJECTED" subtext="Output locked" tone="danger" icon={<LockKeyhole size={18} className="text-red-600" />} />
              <MetricCard label="System status" value="ATTENTION" subtext="Action required" tone="warning" icon={<CircleAlert size={18} className="text-amber-600" />} />
              <MetricCard label="Battery" value={`${demoDeviceStatus.health.batteryLevel}%`} subtext="Low reserve" tone="warning" icon={<BatteryMedium size={18} className="text-amber-600" />} />
              <MetricCard label="Solar" value="Charging" subtext={`${demoDeviceStatus.health.solarVoltage} V`} tone="safe" icon={<SunMedium size={18} className="text-emerald-600" />} />
              <MetricCard label="Current cycle" value="CYC-1028" subtext="Started 08:32" tone="neutral" icon={<Activity size={18} className="text-slate-500" />} />
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
                  <LockKeyhole size={17} />Simulated Solenoid: LOCKED. No release or bypass action is available.
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Latest cycle</p>
                    <h2 className="mt-2 text-xl font-bold text-slate-950">Treatment progress</h2>
                  </div>
                  <StatusBadge tone="danger" label="CYC-1028" />
                </div>
                <div className="mt-5 space-y-3">{demoTreatmentStages.slice(0, 6).map((stage, index) => <div key={stage.name} className="flex items-center gap-3 text-sm"><div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${stage.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{stage.status === 'COMPLETED' ? <CheckCircle2 size={15} /> : <CircleAlert size={15} />}</div><span className="flex-1 font-medium text-slate-700">{stage.name}</span><span className={`text-xs font-semibold ${stage.status === 'COMPLETED' ? 'text-emerald-700' : 'text-red-700'}`}>{stage.status === 'COMPLETED' ? 'PASS' : 'FAIL'}</span>{index < 5 ? <span className="hidden text-slate-300 sm:inline">→</span> : null}</div>)}</div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.15fr_1fr]">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Quick sensor summary</p>
                    <h2 className="mt-2 text-xl font-bold text-slate-950">Water quality snapshot</h2>
                  </div>
                  <Link to="/monitoring" className="text-sm font-semibold text-teal-700 hover:text-teal-900">Full monitoring <ArrowRight size={15} className="ml-1 inline" /></Link>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
                  {[['Inlet pH', demoInletReading.ph, ''], ['Inlet TDS', demoInletReading.tds, ' mg/L'], ['Inlet turbidity', demoInletReading.turbidity, ' NTU'], ['Outlet pH', demoOutletReading.ph, ''], ['Outlet TDS', demoOutletReading.tds, ' mg/L'], ['Outlet turbidity', demoOutletReading.turbidity, ' NTU'], ['UV status', `${demoDeviceStatus.health.uvHealth}%`, ''],].map(([label, value, unit]) => <div key={label as string}><div className="text-xs text-slate-500">{label}</div><div className="mt-1 font-bold text-slate-900">{value}{unit}</div><div className="mt-1 text-xs font-medium text-slate-500">{label === 'Outlet turbidity' ? 'CRITICAL' : 'NORMAL'}</div></div>)}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Recent safety events</p>
                    <h2 className="mt-2 text-xl font-bold text-slate-950">What needs attention</h2>
                  </div>
                  <Link to="/alerts" className="text-sm font-semibold text-teal-700 hover:text-teal-900">All alerts <ArrowRight size={15} className="ml-1 inline" /></Link>
                </div>
                <div className="mt-4 space-y-3">{demoAlerts.slice(0, 3).map((alert) => <div key={alert.id} className="flex gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0"><div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${alert.priority === 'CRITICAL' ? 'bg-red-500' : 'bg-amber-500'}`} /><div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><p className="font-semibold text-slate-800">{alert.title}</p><span className="whitespace-nowrap text-xs text-slate-400">{alert.time}</span></div><p className="mt-1 text-sm text-slate-600">{alert.message}</p></div></div>)}</div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Shortcuts</p>
                  <h2 className="mt-2 text-xl font-bold text-slate-950">Continue in JalSafe</h2>
                </div>
                <span className="text-sm text-slate-500">Latest record: {demoTreatmentRecords[0].id}</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {quickActions.map(({ label, to, icon: Icon }) => <Link key={to} to={to} className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800"><Icon size={18} />{label}<ArrowRight size={15} className="ml-auto" /></Link>)}
              </div>
            </section>

        <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Water & sensor monitoring</h3>
                <StatusBadge tone="danger" label="LOCKED" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <MetricCard label="Inlet pH" value="7.4" subtext="Source water" tone="neutral" />
                <MetricCard label="Inlet TDS" value="610 mg/L" subtext="Source water" tone="neutral" />
                <MetricCard label="Inlet turbidity" value="22.3 NTU" subtext="High solids" tone="warning" />
                <MetricCard label="Temperature" value="28.2°C" subtext="Stable" tone="neutral" />
                <MetricCard label="Inlet flow" value="12.8 L/h" subtext="Normal" tone="neutral" />
                <MetricCard label="Outlet pH" value="6.8" subtext="Within range" tone="safe" />
                <MetricCard label="Outlet TDS" value="470 mg/L" subtext="Acceptable" tone="safe" />
                <MetricCard label="Outlet turbidity" value="2.4 NTU" subtext="Above limit" tone="danger" />
                <MetricCard label="Outlet flow" value="10.6 L/h" subtext="Valid" tone="neutral" />
                <MetricCard label="UV status" value="74%" subtext="Operational" tone="neutral" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Treatment control</h3>
                <StatusBadge tone="danger" label="REJECTED" />
              </div>

              <div className="grid gap-3">
                {demoTreatmentStages.map((stage, index) => (
                  <div key={stage.name} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                      stage.status === 'ACTIVE'
                        ? 'bg-amber-500 text-white'
                        : stage.status === 'FAILED'
                          ? 'bg-red-500 text-white'
                          : stage.status === 'COMPLETED'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-300 text-slate-700'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-800">{stage.name}</div>
                    </div>
                    <StatusBadge
                      tone={
                        stage.status === 'COMPLETED'
                          ? 'safe'
                          : stage.status === 'FAILED'
                            ? 'danger'
                            : stage.status === 'ACTIVE'
                              ? 'warning'
                              : 'neutral'
                      }
                      label={stage.status}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Safety decision</h3>
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4">
                <div className="text-xs font-medium uppercase tracking-[0.14em] text-red-600">Decision</div>
                <div className="mt-2 text-2xl font-bold text-red-700">REJECTED / LOCKED</div>
                <p className="mt-3 text-sm text-red-700">{demoSafetySummary}</p>
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>Unsafe outlet conditions are blocked before release.</p>
                <p>Sensor failure, UV faults, and low battery keep the system locked.</p>
                <p>No manual bypass or force-release action is provided.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Alerts</h3>
              <div className="mt-4 space-y-3">
                {demoAlerts.map((alert) => (
                  <div key={alert.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium text-slate-800">{alert.title}</div>
                      <StatusBadge
                        tone={
                          alert.priority === 'CRITICAL'
                            ? 'danger'
                            : alert.priority === 'WARNING'
                              ? 'warning'
                              : 'neutral'
                        }
                        label={alert.priority}
                      />
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{alert.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Device & filter health</h3>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <MetricCard label="Pump" value="OFF" subtext="Idle" tone="neutral" />
              <MetricCard label="Solenoid" value="LOCKED" subtext="Safety gate" tone="danger" />
              <MetricCard label="UV" value="74%" subtext="Healthy" tone="neutral" />
              <MetricCard label="Battery" value="18%" subtext="Low" tone="warning" />
              <MetricCard label="Connectivity" value="ONLINE" subtext="Stable" tone="safe" />
              <MetricCard label="Calibration" value="VALID" subtext="No action" tone="safe" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Treatment records</h3>
            <div className="mt-4 space-y-3">
              {demoTreatmentRecords.map((record) => (
                <div key={record.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium text-slate-800">{record.id}</div>
                    <StatusBadge
                      tone={
                        record.result === 'VERIFIED'
                          ? 'safe'
                          : record.result === 'LOCKED'
                            ? 'danger'
                            : 'warning'
                      }
                      label={record.result}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                    <span>{record.timestamp}</span>
                    <span>{record.volume}</span>
                  </div>
                  <div className="mt-2 text-sm text-slate-600">{record.reason}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">QR verification</h3>
            <StatusBadge tone="neutral" label="Demo record" />
          </div>
          <div className="mt-4 flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50">
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-xl border-2 border-slate-300 bg-white text-xl font-bold text-slate-700">
                QR
              </div>
              <p className="mt-4 text-sm text-slate-600">Treatment record verification placeholder for QR access.</p>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
