import { Schedule } from './constructs/Scheduler/types';

// Time zone is UTC
// Date format: "2023-01-13T10:00Z"

export const schedule: Schedule = [
  {
    projectSlug: 'konecranes-cgmv-backend',
    clientKeyId: 'a5385b935b3e431e98f5f3da740aac97',
    maintenanceWindow: ['2023-03-18T02:00Z', '2023-03-19T22:00Z'],
  },
];
