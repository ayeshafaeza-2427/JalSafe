# JalSafe

JalSafe is a software prototype for a portable, safety-gated water purification workflow. It demonstrates the PRD's core loop: **Detect → Decide → Purify → Verify → Release/Reject → Alert**.

## What this prototype demonstrates

- Deterministic safety evaluation for inlet/outlet pH, TDS, turbidity, temperature and flow.
- Fail-closed checks for disconnected sensors, expired calibration, low battery, UV health, filter health, invalid UV flow interlock and record-write failure.
- Treatment lifecycle: source check → filtration → UF → UV → outlet verification → safety decision → release/reject.
- Solenoid release is only allowed when the final decision is `VERIFIED`.
- Offline-first local treatment record queue using IndexedDB.
- Tamper-evident SHA-256 audit hash chaining.
- Demo monitoring, alerts, device health, treatment and record/QR views.
- GitHub Actions quality checks for lint, typecheck, tests and production build.

## Safety scope

This is a software simulation and competition prototype. It does **not** certify water as universally safe, replace laboratory testing, or control physical hardware. The UI clearly labels simulated readings. The release rule is intentionally conservative: an unknown, failed or unverifiable critical condition must not release output.

## Run locally

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run lint
npm run typecheck
npm test -- --run
npm run build
```

If Supabase is configured, copy `.env.example` to `.env.local` and provide only the public/publishable client key. Never expose a Supabase service-role/secret key in the frontend.

## Architecture

```text
Simulated/Device Readings
          ↓
    Safety Engine
          ↓
 Treatment Controller
          ↓
Outlet Verification
          ↓
 Safety Decision
     ↙          ↘
REJECT/LOCK    VERIFIED/RELEASE
          ↓
 Local Record + Audit Hash Chain
          ↓
 Optional Cloud Sync
```

The safety engine is pure and deterministic so critical release logic does not depend on UI state or cloud connectivity.
