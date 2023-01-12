import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';

import { RootStack } from './RootStack';

describe('RootStack', () => {
  it('produces a correct CloudFormation template', () => {
    const app = new App();
    const stack = new RootStack(app, 'test-app', {
      env: {
        account: 'dummy-account',
        region: 'dummy-region',
      },
    });
    const template = Template.fromStack(stack);
    expect(template.toJSON()).toMatchSnapshot();
  });
});
