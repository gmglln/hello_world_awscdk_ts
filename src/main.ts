import { App, CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Pipeline } from 'aws-cdk-lib/aws-codepipeline';
import * as event from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as sns from 'aws-cdk-lib/aws-sns';

import { Construct } from 'constructs';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    // SNS topic
    const topic = new sns.Topic(this, 'TriggerTopic');

    // EventBridge rule
    const rule = new event.Rule(this, 'Rule', {
      eventPattern: {
        source: ['aws.sns'],
        detailType: ['Standard Event'],
      },
    });

    const pipeline: Pipeline = Pipeline.fromPipelineArn(this, 'Pipeline', 'arn:aws:codepipeline:us-east-1:123456789012:MyDemoPipeline');

    // SNS topic as target
    rule.addTarget(new targets.CodePipeline(pipeline));

    new CfnOutput(this, 'SnsTopicArn', {
      value: topic.topicArn,
      description: 'SNS Topic Arn',
    });

    new CfnOutput(this, 'SnsTopicName', {
      value: topic.topicName,
      description: 'SNS Topic Name',
    });

  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new MyStack(app, 'hello-world-awscdk-ts-dev', { env: devEnv });
// new MyStack(app, 'hello_world_awscdk_ts-prod', { env: prodEnv });

app.synth();