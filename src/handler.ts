import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import * as aws from 'aws-sdk';

// dynamodb
const dynamodb = new aws.DynamoDB.DocumentClient({ region: 'ap-northeast-1' });
const tablename = 'learning_lambda_typescript';

export const hello: APIGatewayProxyHandler = async (event, _context) => {
    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message:
                    'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
                input: event,
            },
            null,
            2
        ),
    };
};

export const get: APIGatewayProxyHandler = async (event, _context) => {
    console.log(':Hamster:');
    console.log('event: ', event);
    console.log('event.id ', event.id);
    const params = {
        TableName: tablename,
        Key: { id: event.id },
    };
    const result: aws.DynamoDB.GetItemOutput = await dynamodb.get(params).promise();
    console.log('GET result: ', result);
    return {
        statusCode: 200,
        body: JSON.stringify(result.Item),
    };
};

export const put: APIGatewayProxyHandler = async (event, _context) => {
    console.log(':Hamster:');
    console.log('event: ', event, event);
    console.log('event.id: ', event.id);
    const params = {
        TableName: tablename,
        Key: { id: event.id },
        UpdateExpression: 'set first_name = :f, last_name=:l',
        ExpressionAttributeValues: {
            ':f': event.first_name,
            ':l': event.last_name,
        },
        ReturnValues: 'UPDATED_NEW',
    };
    const result: aws.DynamoDB.GetItemOutput = await dynamodb.update(params).promise();
    console.log('PUT result: ', result);
    return {
        statusCode: 200,
        body: JSON.stringify(result),
    };
};
