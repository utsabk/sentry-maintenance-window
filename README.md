# sentry-maintenance-window

It disables reporting to Sentry for a specific time.

A lambda runs every 30 minutes and checks for entries in the config file to enable/disable a Sentry project public key .

## How to use

1. Add an entry to `src/config.ts`:

```
{
  projectSlug: 'sentry project name', // Project Settings > General
  clientKey: 'public key', // Project Settings > Client Keys > Configure
  downtimeRange: ['2023-01-12T10:00Z', '2023-01-12T10:30Z'], // UTC time zone, increments of 30 mins
},
```

2. Open a pull request to `main`.

## Deployment

When merged into *main*.

## AWS account, credentials and secrets

AWS account and region are set in `src/app` and `.github/workflows/deployment.yml`.

AWS credentials are stored in [GitHub Secrets](https://github.com/nordcloud/sentry-maintenance-window/settings/secrets/actions).

Sentry API token is stored in AWS Secrets Manager - "sentryMaintenanceWindow/SentryApiToken"