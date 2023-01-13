type DateString = `${number}-${number}-${number}T${number}:${number}Z`;

export type Schedule = Array<{
  projectSlug: string;
  publicKey: string;
  maintenanceWindow: [DateString, DateString];
}>;
