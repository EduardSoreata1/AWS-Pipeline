import { Construct } from 'constructs';
import { Resource, SecretValue, Stack, StackProps, aws_codepipeline as codepipeline, aws_codepipeline_actions as codepipeline_actions } from 'aws-cdk-lib';
import { AuthorizationType, CognitoUserPoolsAuthorizer, HttpIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { UserPool, VerificationEmailStyle, AccountRecovery, CfnIdentityPool, UserPoolClient, CfnIdentityPoolRoleAttachment } from 'aws-cdk-lib/aws-cognito';
import { Effect, FederatedPrincipal, PolicyStatement, Role } from 'aws-cdk-lib/aws-iam';

export class AwsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const api = new RestApi(this, 'eduard-api');

    api.root.addMethod('ANY');

    const resource = api.root.addResource('resource');

    const pool = new UserPool(this, 'EduardCDKUserPool4', {
      userPoolName: 'EduardCDKUserPool4',
      signInCaseSensitive: false,
      selfSignUpEnabled: true,
      userVerification: {
        emailSubject: 'Please verify your email!',
        emailBody: 'Thanks for signing up to our awesome app! Your verification code is {####}',
        emailStyle: VerificationEmailStyle.CODE,
      },
      signInAliases: {
        username: true,
        email: true
      },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
      standardAttributes: {
        fullname: {
          required: true,
          mutable: false,
        },
        address: {
          required: false,
          mutable: true,
        },
        email: {
          required: true,
          mutable: false
        },
      },
      keepOriginal: {
        email: true
      },
    });

    const client = pool.addClient('EduardAPPClient', {
      oAuth: {
        flows: {
          implicitCodeGrant: true,
          authorizationCodeGrant: true,
        },
        callbackUrls: [
          'https://example.com/callback',
        ],
        logoutUrls: [
          'https://example.com/signout',
        ]
      }
    });

    const auth = new CognitoUserPoolsAuthorizer(this, 'eduardAuthorizer', {
      cognitoUserPools: [pool]
    });

    resource: Resource;
    resource.addMethod('GET', new HttpIntegration('http://amazon.com'), {
      authorizer: auth,
      authorizationType: AuthorizationType.COGNITO,
    });

    const clientID = new UserPoolClient(this, 'MyUserPoolClient', {
      generateSecret: false,
      userPool: pool,
      userPoolClientName: 'MyUserPoolClientName'
    });

    pool.addDomain('CognitoDomain', {
      cognitoDomain: {
        domainPrefix: 'eduard-domain-cdk',
      },
    });

    const identityPool = new CfnIdentityPool(this, 'EduardIdentityPool', {
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [{
        clientId: clientID.userPoolClientId,
        providerName: pool.userPoolProviderName,
      }]
    });

    const unauthenticatedRole = new Role(this, 'CognitoDefaultUnauthenticatedRole', {
      assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
        "StringEquals": { "cognito-identity.amazonaws.com:aud": identityPool.ref },
        "ForAnyValue:StringLike": { "cognito-identity.amazonaws.com:amr": "unauthenticated" },
      }, "sts:AssumeRoleWithWebIdentity"),
    });

    unauthenticatedRole.addToPolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        "mobileanalytics:PutEvents",
        "cognito-sync:*"
      ],
      resources: ["*"],
    }));

    const authenticatedRole = new Role(this, 'CognitoDefaultAuthenticatedRole', {
      assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com', {
        "StringEquals": { "cognito-identity.amazonaws.com:aud": identityPool.ref },
        "ForAnyValue:StringLike": { "cognito-identity.amazonaws.com:amr": "authenticated" },
      }, "sts:AssumeRoleWithWebIdentity"),
    });

    authenticatedRole.addToPolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        "mobileanalytics:PutEvents",
        "cognito-sync:*",
        "cognito-identity:*"
      ],
      resources: ["*"],
    }));

    const defaultPolicy = new CfnIdentityPoolRoleAttachment(this, 'DefaultValid', {
      identityPoolId: identityPool.ref,
      roles: {
        'unauthenticated': unauthenticatedRole.roleArn,
        'authenticated': authenticatedRole.roleArn
      }
    });


  }
}
