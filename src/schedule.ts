import { Schedule } from './constructs/Scheduler/types';

// Time zone is UTC
// Date format: "2023-01-13T10:00Z"

export const schedule: Schedule = [
  {
    projectSlug: 'skf-dmc-bearing-backend',
    publicKey: 'd835311c799b4743a7b83e7258663315',
    maintenanceWindow: ['2023-01-13T12:00Z', '2023-01-13T12:10Z'],
  },
];
