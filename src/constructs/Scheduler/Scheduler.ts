import { NestedStack } from 'aws-cdk-lib';
import { Rule, Schedule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

import { sentryTokenSecretManagerId } from './consts';

export class Scheduler extends NestedStack {
  constructor(scope: Construct) {
    super(scope, 'Scheduler');

    const fn = new NodejsFunction(this, 'lambda', {
      entry: `${__dirname}/handler.ts`,
      runtime: Runtime.NODEJS_18_X,
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
      },
      bundling: {
        sourceMap: true,
        minify: true,
      },
    });

    new Rule(this, 'rule', {
      schedule: Schedule.cron({ minute: '0/30' }),
      targets: [new LambdaFunction(fn)],
    });

    const sentrySecret = Secret.fromSecretNameV2(
      this,
      'sentry-secret',
      sentryTokenSecretManagerId
    );

    sentrySecret.grantRead(fn);
  }
}
