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

export const postHandler: APIGatewayProxyHandler = async (event, _context) => {
    console.log('event: ', event);

    const params = {
        TableName: tablename,
        Item: {
            createdTime: JSON.parse(event.body).createdTime,
            updatedTime: JSON.parse(event.body).updatedTime,
            text: JSON.parse(event.body).text,
        },
    };
    console.log(params);
    const result: aws.DynamoDB.GetItemOutput = await dynamodb.put(params).promise();
    console.log('POST result: ', result);

    return {
        statusCode: 200,
        body: JSON.stringify(result),
    };
};

export const getHandler: APIGatewayProxyHandler = async (event, _context) => {
    console.log('event: ', event);

    if (event.queryStringParameters === null) {
        const params = {
            TableName: tablename,
        };
        const result: aws.DynamoDB.GetItemOutput = await dynamodb.scan(params).promise();
        console.log('GET All result: ', result);
        return {
            statusCode: 200,
            body: JSON.stringify(result.Items),
        };
    } else {
        const params = {
            TableName: tablename,
            Key: { createdTime: event.queryStringParameters.createdTime },
        };
        const result: aws.DynamoDB.GetItemOutput = await dynamodb.get(params).promise();
        console.log('GET result: ', result);
        return {
            statusCode: 200,
            body: JSON.stringify(result.Item),
        };
    }
};

export const putHandler: APIGatewayProxyHandler = async (event, _context) => {
    console.log('event: ', event);

    const params = {
        TableName: tablename,
        Key: { createdTime: event.queryStringParameters.createdTime },
        UpdateExpression: 'set updatedTime = :u, text=:t',
        ExpressionAttributeValues: {
            ':u': JSON.parse(event.body).updatedTime,
            ':t': JSON.parse(event.body).text,
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

export const deleteHandler: APIGatewayProxyHandler = async (event, _context) => {
    console.log('event: ', event);

    const params = {
        TableName: tablename,
        Key: { createdTime: event.queryStringParameters.createdTime },
    };
    const result: aws.DynamoDB.GetItemOutput = await dynamodb.delete(params).promise();
    console.log('DELETE result: ', result);

    return {
        statusCode: 200,
        body: JSON.stringify(result),
    };
};
