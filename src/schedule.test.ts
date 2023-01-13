import { CHECK_RATE_MILLIS } from './constructs/Scheduler/consts';
import { schedule } from './schedule';

describe('schedule', () => {
  test('start time and end time are valid', () => {
    schedule.forEach(({ maintenanceWindow }) => {
      const startTime = new Date(maintenanceWindow[0]).getTime();
      const endTime = new Date(maintenanceWindow[1]).getTime();

      expect(endTime - startTime).toBeGreaterThanOrEqual(CHECK_RATE_MILLIS);
    });
  });
});
