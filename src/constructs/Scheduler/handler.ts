import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { ScheduledHandler } from 'aws-lambda';
import fetch from 'node-fetch';

import { schedule } from '../../schedule';
import { CHECK_RATE_MS, ORGANIZATION_SLUG, SENTRY_TOKEN_SSM_ID } from './consts';

const ssmClient = new SecretsManagerClient({});

export const handler: ScheduledHandler = async () => {
  const dateNow = new Date();

  const pendingItems = schedule.filter(({ maintenanceWindow }) => {
    const [startDate, endDate] = maintenanceWindow;
    return isInRange(startDate, dateNow) || isInRange(endDate, dateNow);
  });

  if (!pendingItems.length) {
    console.log('Nothing to do, exiting.');
    return;
  }

  console.log('Fetching Sentry token.');

  const sentryToken = await fetchSentryToken();

  if (sentryToken) {
    console.log('Sentry token fetched.');
  } else {
    throw new Error('Sentry token is missing!');
  }

  await Promise.all(
    pendingItems.map(async ({ projectSlug, clientKeyId, maintenanceWindow }) => {
      try {
        const [startDate] = maintenanceWindow;
        const newStateActive = !isInRange(startDate, dateNow);

        console.log(
          `${
            newStateActive ? 'Activating' : 'Deactivating'
          } key "${clientKeyId}" for project "${projectSlug}".`
        );

        const response = await toggleSentryKey({
          projectSlug,
          sentryToken,
          clientKeyId,
          isActive: newStateActive,
        });

        console.log('Response status', response?.status);
        console.log('Response body', await response?.json());
      } catch (error) {
        console.error(error);
      }
    })
  );
};

function isInRange(targetDateString: string, dateNow: Date) {
  const target = new Date(targetDateString).getTime();
  const now = dateNow.getTime();
  return target > now && target < now + CHECK_RATE_MS;
}

async function fetchSentryToken() {
  const command = new GetSecretValueCommand({
    SecretId: SENTRY_TOKEN_SSM_ID,
  });
  const { SecretString } = await ssmClient.send(command);
  return SecretString;
}

function toggleSentryKey({
  isActive,
  projectSlug,
  sentryToken,
  clientKeyId,
}: {
  isActive: boolean;
  projectSlug: string;
  sentryToken: string;
  clientKeyId: string;
}) {
  const url = `https://sentry.io/api/0/projects/${ORGANIZATION_SLUG}/${projectSlug}/keys/${clientKeyId}/`;

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${sentryToken}`,
  };

  const body = JSON.stringify({ isActive });

  return fetch(url, {
    method: 'PUT',
    headers,
    body,
  });
}
