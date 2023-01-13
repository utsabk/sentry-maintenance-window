import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import fetch from 'node-fetch';

import { configEntries } from '../../config';
import { sentryTokenSecretManagerId } from './consts';

const ssmClient = new SecretsManagerClient({});

export const handler: APIGatewayProxyHandlerV2<unknown> = async () => {
  const dateNow = new Date();

  const pendingItems = configEntries.filter(({ downtimePeriod }) => {
    const [startDate, endDate] = downtimePeriod;
    return isInRange(startDate, dateNow) || isInRange(endDate, dateNow);
  });

  if (!pendingItems.length) {
    console.log('No pending items, exiting.');
    return undefined;
  }

  console.log('Fetching Sentry token.');
  const sentryToken = await getSentryToken();

  if (sentryToken) {
    console.log('Sentry token fetched.');
  } else {
    throw new Error('Sentry token is missing!');
  }

  return Promise.allSettled(
    pendingItems.map(async ({ projectSlug, clientKey, downtimePeriod }) => {
      try {
        const [startDate] = downtimePeriod;
        const newStateActive = !isInRange(startDate, dateNow);

        console.log(
          `${
            newStateActive ? 'Activating' : 'Deactivating'
          } key "${clientKey}" for project "${projectSlug}"`
        );

        const response = await toggleSentryKey({
          projectSlug,
          sentryToken,
          clientKey,
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
  const lambdaDelay = 30 * 1000; // assume lambda start time is less then 30 seconds
  return now >= target && now < target + lambdaDelay;
}

async function getSentryToken() {
  const command = new GetSecretValueCommand({
    SecretId: sentryTokenSecretManagerId,
  });
  const { SecretString } = await ssmClient.send(command);
  return SecretString;
}

async function toggleSentryKey({
  isActive,
  projectSlug,
  sentryToken,
  clientKey,
}: {
  isActive: boolean;
  projectSlug: string;
  sentryToken: string;
  clientKey: string;
}) {
  const url = `https://sentry.io/api/0/projects/nordcloud-v4/${projectSlug}/keys/${clientKey}/`;

  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sentryToken}`,
    },
    body: JSON.stringify({ isActive }),
  });
}
