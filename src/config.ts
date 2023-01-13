import { Config } from './constructs/Scheduler/types';

// Time zone is UTC
// Date format: "2023-01-13T10:30Z"
// Only whole and half hours are accepted

export const configEntries: Config = [
  {
    projectSlug: 'skf-dmc-bearing-backend',
    clientKey: 'd835311c799b4743a7b83e7258663315',
    downtimePeriod: ['2023-01-13T08:00Z', '2023-01-13T08:30Z'],
  },
];
