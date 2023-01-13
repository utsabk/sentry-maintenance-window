type DateString = `${number}-${number}-${number}T${number}:${'00' | '30'}Z`;

export type Schedule = Array<{
  projectSlug: string;
  publicKey: string;
  maintenanceWindow: [DateString, DateString];
}>;
