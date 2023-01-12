import { App } from 'aws-cdk-lib';

import { RootStack } from './constructs/RootStack/RootStack';

const app = new App();

new RootStack(app, 'sentry-maintenance-window', {
  env: {
    account: '018955960688',
    region: 'eu-central-1',
  },
});
