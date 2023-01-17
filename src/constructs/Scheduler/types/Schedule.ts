type DateString = `${number}-${number}-${number}T${number}:${number}Z`;

export type Schedule = Array<{
  projectSlug: string;
  clientKeyId: string;
  maintenanceWindow: [DateString, DateString];
}>;
