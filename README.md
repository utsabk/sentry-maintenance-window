# sentry-maintenance-window

This temporarily disables accepting events for a Sentry key.

## How to use

Add an entry to `src/config.ts`:

```
{
  projectSlug: 'slug',
  clientKey: 'key',
  downtimePeriod: ['2023-01-12T10:00Z', '2023-01-12T10:30Z']
},
```

## Deploy

Push to *main* branch.

## AWS account, credentials and secrets

AWS account and region are set in `src/app` and `.github/workflows/deployment.yml`.

AWS credentials are stored in [GitHub Secrets](https://github.com/nordcloud/sentry-maintenance-window/settings/secrets/actions).

Sentry API token is stored in AWS Secrets Manager - "sentryMaintenanceWindow/SentryApiToken"