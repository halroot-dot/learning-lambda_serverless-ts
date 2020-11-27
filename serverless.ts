import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
    service: {
        name: 'learning-lambda-typescript',
        // app and org for use with dashboard.serverless.com
        // app: your-app-name,
        // org: your-org-name,
    },
    frameworkVersion: '2',
    custom: {
        webpack: {
            webpackConfig: './webpack.config.js',
            includeModules: true,
        },
    },
    // Add the serverless-webpack plugin
    plugins: ['serverless-webpack'],
    provider: {
        name: 'aws',
        runtime: 'nodejs12.x',
        region: 'ap-northeast-1',
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            DYNAMODB_TABLE: 'learning_lambda_typescript',
        },
        iamRoleStatements: [
            {
                Effect: 'Allow',
                Action: [
                    'dynamodb:Query',
                    'dynamodb:Scan',
                    'dynamodb:GetItem',
                    'dynamodb:PutItem',
                    'dynamodb:UpdateItem',
                    'dynamodb:DeleteItem',
                ],
                Resource:
                    'arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/${self:provider.environment.DYNAMODB_TABLE}',
            },
        ],
        apiGateway: {
            minimumCompressionSize: 1024,
        },
    },
    // lambdaの設定
    functions: {
        getTest: {
            handler: 'src/handler.get',
            events: [
                {
                    http: {
                        method: 'get',
                        path: 'src/handler',
                    },
                },
            ],
        },
        putTest: {
            handler: 'src/handler.put',
            events: [
                {
                    http: {
                        method: 'put',
                        path: 'src/handler',
                    },
                },
            ],
        },
    },
    // DynamoDBの設定
    resources: {
        Resources: {
            LearningLambdaTable: {
                Type: 'AWS::DynamoDB::Table',
                Properties: {
                    TableName: 'learning_lambda_typescript',
                    AttributeDefinitions: [
                        {
                            AttributeName: 'id',
                            AttributeType: 'N', //Number
                        },
                    ],
                    KeySchema: [
                        {
                            AttributeName: 'id',
                            KeyType: 'HASH',
                        },
                    ],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 1,
                        WriteCapacityUnits: 1,
                    },
                },
            },
        },
    },
};

module.exports = serverlessConfiguration;
