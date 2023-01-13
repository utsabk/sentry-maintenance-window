# sentry-maintenance-window

This is used to disable a Sentry client key for a certain period.

## How to use

Add an entry to `src/config.ts`. Example:

```
{
  projectSlug: 'slug',
  publicKey: 'key',
  maintenanceWindow: ['2023-01-12T10:00Z', '2023-01-12T10:30Z']
},
```

Get **projectSlug** from `Project Settings > Name`

Get **publicKey** from `Projct Settings > Client Keys (DSN) > Configure > Public Key`

## Deploy

Push to *main* branch.

## Changing AWS account, credentials and secrets

AWS account and region are set in `src/app` and `.github/workflows/deployment.yml`.

AWS credentials are stored in [GitHub Secrets](https://github.com/nordcloud/sentry-maintenance-window/settings/secrets/actions).

Sentry API token is stored in AWS Secrets Manager - "sentryMaintenanceWindow/SentryApiToken"