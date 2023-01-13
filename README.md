# sentry-maintenance-window

This is used to temporarily disable a Sentry public key.



## How to use

Add an entry to `src/schedule.ts`. Example:

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

AWS account and region are used in `src/app.ts` and `.github/workflows/deployment.yml`.

Credentials are in [GitHub Secrets](https://github.com/nordcloud/sentry-maintenance-window/settings/secrets/actions).

Sentry API token is in *AWS Secrets Manager* - `sentryMaintenanceWindow/SentryApiToken`.