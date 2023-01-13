import { Duration } from 'aws-cdk-lib';
import { Rule, Schedule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

import { CHECK_RATE_MILLIS, SENTRY_TOKEN_SSM_ID } from './consts';

export class Scheduler extends Construct {
  constructor(scope: Construct) {
    super(scope, 'Scheduler');

    const fn = new NodejsFunction(this, 'Lambda', {
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

    new Rule(this, 'Rule', {
      schedule: Schedule.rate(Duration.millis(CHECK_RATE_MILLIS)),
      targets: [new LambdaFunction(fn)],
    });

    const sentrySecret = Secret.fromSecretNameV2(
      this,
      'Sentry-token',
      SENTRY_TOKEN_SSM_ID
    );

    sentrySecret.grantRead(fn);
  }
}
