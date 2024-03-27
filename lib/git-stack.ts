
import { Construct } from 'constructs';
import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import * as dynamoDB from 'aws-cdk-lib/aws-dynamodb'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import apigateway = require('aws-sdk/clients/apigateway');
import { ApiKey, ApiKeySourceType, Cors, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';

export class GitStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

  const dynamoDB_table = new dynamoDB.Table(this, "EduardTable",
      {partitionKey: { name: 'pk', type: dynamoDB.AttributeType.STRING },
      sortKey:{name:"sk", type:dynamoDB.AttributeType.STRING},
      removalPolicy:RemovalPolicy.DESTROY,
      })

      const scanFunction = new NodejsFunction(this, 
        'function', 
        {environment: {DYNAMODB: dynamoDB_table.tableName}});
        dynamoDB_table.grantFullAccess(scanFunction.role!);
  
        const api = new RestApi(this, 'RestAPI');
      // const apiKey = new ApiKey(this, 'ApiKey');
      const scan = api.root.addResource('scan');
      const scanIntegration = new LambdaIntegration(scanFunction);
      scan.addMethod('GET', scanIntegration);
      }
  

  
}