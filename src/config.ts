import { Config } from './constructs/Scheduler/types';

// Date format is "2023-01-13T10:30Z",
// Time zone is UTC
// Increments of 30 minutes only

export const configEntries: Config = [
  {
    projectSlug: 'skf-dmc-bearing-backend',
    clientKey: 'd835311c799b4743a7b83e7258663315',
    downtimeRange: ['2023-01-12T15:30Z', '2023-01-12T16:00Z'],
  },
];
