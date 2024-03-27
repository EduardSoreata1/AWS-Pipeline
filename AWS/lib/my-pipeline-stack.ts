import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Stack, StackProps } from 'aws-cdk-lib';

export class MyPipelineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'EduardPipeline',
            synth: new ShellStep('Synth', {
                input: CodePipelineSource.gitHub('EduardSoreata1/AWS-Pipeline', 'main'),
                commands: ['npm ci', 'npm run build', 'npx cdk synth']
            })
        });
    }
}