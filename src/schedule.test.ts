import { schedule } from './schedule';

describe('schedule', () => {
  test('start time is before end time', () => {
    schedule.forEach(({ maintenanceWindow }) => {
      const startTime = new Date(maintenanceWindow[0]).getTime();
      const endTime = new Date(maintenanceWindow[1]).getTime();

      expect(startTime).toBeLessThan(endTime);
    });
  });
});
