import { describe, expect, it } from 'vitest';
import { evaluateSafety, isReleaseAllowed } from './safety-engine';
import { demoDeviceStatus, demoInletReading, demoOutletReading } from './demo-data';

const base = {
  inlet: demoInletReading,
  outlet: { ...demoOutletReading, turbidity: 0.4 },
  health: demoDeviceStatus.health,
  treatmentCompleted: true,
  recordWritable: true,
  uvFlowInterlockOk: true,
};

describe('JalSafe safety engine', () => {
  it('verifies an outlet within all configured limits', () => {
    const decision = evaluateSafety(base);
    expect(decision.passed).toBe(true);
    expect(decision.state).toBe('VERIFIED');
    expect(isReleaseAllowed(decision)).toBe(true);
  });

  it('locks release when outlet turbidity is unsafe', () => {
    const decision = evaluateSafety({ ...base, outlet: demoOutletReading });
    expect(decision.passed).toBe(false);
    expect(decision.rejectionCode).toBe('OUTLET_TURBIDITY_HIGH');
    expect(isReleaseAllowed(decision)).toBe(false);
  });

  it('fails closed when a required sensor is disconnected', () => {
    const decision = evaluateSafety({
      ...base,
      outlet: { ...base.outlet, ph: null },
    });
    expect(decision.passed).toBe(false);
    expect(decision.rejectionCode).toBe('SENSOR_DISCONNECTED');
    expect(isReleaseAllowed(decision)).toBe(false);
  });

  it('fails closed when calibration has expired', () => {
    const decision = evaluateSafety({
      ...base,
      health: { ...base.health, calibrationStatus: 'EXPIRED' },
    });
    expect(decision.rejectionCode).toBe('CALIBRATION_EXPIRED');
    expect(isReleaseAllowed(decision)).toBe(false);
  });

  it('fails closed when the UV flow interlock is not valid', () => {
    const decision = evaluateSafety({ ...base, uvFlowInterlockOk: false });
    expect(decision.rejectionCode).toBe('FLOW_OUT_OF_RANGE');
    expect(isReleaseAllowed(decision)).toBe(false);
  });

  it('fails closed when the treatment record cannot be written', () => {
    const decision = evaluateSafety({ ...base, recordWritable: false });
    expect(decision.rejectionCode).toBe('RECORD_WRITE_FAILURE');
    expect(isReleaseAllowed(decision)).toBe(false);
  });
});
