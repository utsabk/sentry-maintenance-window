import { App, Stack, StackProps } from 'aws-cdk-lib';

import { Scheduler } from '../Scheduler/Scheduler';

export class RootStack extends Stack {
  constructor(scope: App, id: string, props: StackProps) {
    super(scope, id, props);

    new Scheduler(this);
  }
}
