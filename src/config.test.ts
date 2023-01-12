import { configEntries } from './config';

describe('config', () => {
  test('start date is before end date', () => {
    configEntries.forEach(({ downtimePeriod }) => {
      const startTimestamp = new Date(downtimePeriod[0]).getTime();
      const endTimestamp = new Date(downtimePeriod[1]).getTime();
      expect(startTimestamp).toBeLessThan(endTimestamp);
    });
  });
});
