import { configEntries } from './config';

describe('config', () => {
  test('start date is before end date', () => {
    configEntries.forEach(({ downtimeRange }) => {
      const startTimestamp = new Date(downtimeRange[0]).getTime();
      const endTimestamp = new Date(downtimeRange[1]).getTime();
      expect(startTimestamp).toBeLessThan(endTimestamp);
    });
  });
});
