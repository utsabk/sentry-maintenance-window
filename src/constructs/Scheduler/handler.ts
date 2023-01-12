import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import fetch from 'node-fetch';

import { configEntries } from '../../config';

const SENTRY_API_TOKEN_SSM_ID = 'sentryMaintenanceWindow/SentryApiToken';
const ssmClient = new SecretsManagerClient({});

export const handler: APIGatewayProxyHandlerV2<unknown> = async () => {
  const now = new Date();

  const pendingItems = configEntries.filter(({ downtimeRange }) => {
    const [startDate, endDate] = downtimeRange;
    return isDateInRange(startDate, now) || isDateInRange(endDate, now);
  });

  if (!pendingItems) {
    console.log('No pending items');
    return undefined;
  }

  const sentryToken = await getSentryToken();

  if (!sentryToken) {
    throw new Error('Sentry token is missing');
  }

  return Promise.allSettled(
    pendingItems.map(async ({ projectSlug, clientKey, downtimeRange }) => {
      const [endDate] = downtimeRange;
      const resp = await toggleSentryKey({
        projectSlug,
        sentryToken,
        clientKey,
        isActive: isDateInRange(endDate, now),
      });
      console.log('Response status', resp?.status);
      console.log('Response body', resp?.body);
    })
  );
};

function isDateInRange(dateString: string, now: Date) {
  const timestamp = new Date(dateString).getTime();
  const offset = 1 * 60 * 1000; // 1 minute
  const offsetStart = now.getTime() - offset;
  const offsetEnd = now.getTime() + offset;
  return timestamp > offsetStart && timestamp < offsetEnd;
}

async function getSentryToken() {
  console.log('Fetching Sentry API token');
  const command = new GetSecretValueCommand({
    SecretId: SENTRY_API_TOKEN_SSM_ID,
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
