import { SNSEvent, SNSHandler } from 'aws-lambda';
import 'source-map-support/register';
import { createApiGateway } from 'src/utils/apiGateway';
import { createDynamoDBClient } from 'src/utils/dynamoDbClient';

const docClient = createDynamoDBClient()

const connectionsTable = process.env.CONNECTIONS_TABLE

const apiGateway = createApiGateway()

export const handler: SNSHandler = async (event: SNSEvent) => {
    console.log("pong!!!");
    console.log(event.Records[0].Sns);

    const message = JSON.parse(event.Records[0].Sns.Message)
    console.log('Processing SNS event ', message);

    const connections = await docClient.scan({
        TableName: connectionsTable
    }).promise()

    for (const connection of connections.Items) {
        const connectionId = connection.id
        await sendMessageToClient(connectionId, message)
    }
}

async function sendMessageToClient(connectionId, payload) {
    try {
        console.log('Sending message to a connection', connectionId);

        await apiGateway.postToConnection({
            ConnectionId: connectionId,
            Data: JSON.stringify(payload)
        }).promise()

    } catch (e) {
        console.log('Failed to send message', JSON.stringify(e));
        if (e.statusCode === 410) {
            console.log('Stale connection');

            await docClient.delete({
                TableName: connectionsTable,
                Key: {
                    id: connectionId
                }
            }).promise()

        }
    }
}

