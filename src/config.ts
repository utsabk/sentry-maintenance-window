import { Config } from './constructs/Scheduler/types';

// Date format is "2023-01-13T10:30Z",
// Time zone is UTC
// Whole and half hours only.

export const configEntries: Config = [
  {
    projectSlug: 'skf-dmc-bearing-backend',
    clientKey: 'd835311c799b4743a7b83e7258663315',
    downtimePeriod: ['2023-01-12T17:00Z', '2023-01-12T17:30Z'],
  },
];
