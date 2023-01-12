type DateString = `${number}-${number}-${number}T${number}:${'00' | '30'}Z`;

export type Config = Array<{
  projectSlug: string;
  clientKey: string;
  downtimePeriod: [DateString, DateString];
}>;
