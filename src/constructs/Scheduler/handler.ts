import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import fetch from 'node-fetch';

import { schedule } from '../../schedule';
import { CHECK_RATE_MS, ORGANIZATION_SLUG, SENTRY_TOKEN_SSM_ID } from './consts';

const ssmClient = new SecretsManagerClient({});

export const handler: APIGatewayProxyHandlerV2<unknown> = async () => {
  const dateNow = new Date();

  const pendingItems = schedule.filter(({ maintenanceWindow }) => {
    const [startDate, endDate] = maintenanceWindow;
    return isInRange(startDate, dateNow) || isInRange(endDate, dateNow);
  });

  if (!pendingItems.length) {
    console.log('Nothing to do, exiting.');
    return undefined;
  }

  console.log('Fetching Sentry token.');
  const sentryToken = await getSentryToken();

  if (sentryToken) {
    console.log('Sentry token fetched.');
  } else {
    throw new Error('Sentry token is missing!');
  }

  return Promise.all(
    pendingItems.map(async ({ projectSlug, publicKey, maintenanceWindow }) => {
      try {
        const [startDate] = maintenanceWindow;
        const newStateActive = !isInRange(startDate, dateNow);

        console.log(
          `${
            newStateActive ? 'Activating' : 'Deactivating'
          } key "${publicKey}" for project "${projectSlug}"`
        );

        const response = await toggleSentryKey({
          projectSlug,
          sentryToken,
          publicKey,
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

async function getSentryToken() {
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
  publicKey,
}: {
  isActive: boolean;
  projectSlug: string;
  sentryToken: string;
  publicKey: string;
}) {
  const url = `https://sentry.io/api/0/projects/${ORGANIZATION_SLUG}/${projectSlug}/keys/${publicKey}/`;

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
