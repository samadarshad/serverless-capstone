import { SNSEvent, SNSHandler } from 'aws-lambda';
import 'source-map-support/register';
import { createApiGateway } from 'src/utils/apiGateway';
import { createDynamoDBClient } from 'src/utils/dynamoDbClient';

const docClient = createDynamoDBClient()

const connectionsTable = process.env.CONNECTIONS_TABLE

const apiGateway = createApiGateway()

export const handler: SNSHandler = async (event: SNSEvent) => {
    const data = JSON.parse(event.Records[0].Sns.Message)
    const user = await getUser(data.connectionId)
    console.log("user", user);

    const text = data.message
    const payload: Message = {
        user,
        text,
    }

    await broadcastToRoom(payload)
}

async function broadcastToRoom(message: Message) {
    const connections = await docClient.scan({
        TableName: connectionsTable
    }).promise()

    for (const connection of connections.Items) {
        const connectionId = connection.connectionId

        await sendMessageToClient(connectionId, message)
    }
}

async function getUser(connectionId) {

    console.log("getting user from connectionId: ", connectionId);
    const result = await docClient.query({
        TableName: connectionsTable,
        KeyConditionExpression: 'connectionId = :connectionId',
        ExpressionAttributeValues: {
            ':connectionId': connectionId
        }
    }).promise()
    console.log("result", result);
    if (result.Count !== 0) {
        const name = result.Items[0].name

        console.log("found username", name);

        return name
    } else {
        console.log("didnt find connection");
        return "no username"
        // return connectionId.slice(-5)
        // return null
    }
}

interface Message {
    user: string
    text: string
}

async function sendMessageToClient(connectionId, payload: Message) {
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
                    connectionId
                }
            }).promise()

        }
    }
}

