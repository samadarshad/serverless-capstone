import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { createApiGateway } from 'src/utils/apiGateway'
import { createDynamoDBClient } from 'src/utils/dynamoDbClient'

const docClient = createDynamoDBClient()

const connectionsTable = process.env.CONNECTIONS_TABLE

const apiGateway = createApiGateway()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Websocket send message: ', event)

    const connectionId = event.requestContext.connectionId
    const timestamp = new Date().toISOString()
    const message = JSON.parse(event.body)

    const connections = await docClient.scan({
        TableName: connectionsTable
    }).promise()

    const payload = {
        connectionId,
        timestamp,
        message
    }

    for (const connection of connections.Items) {
        const connectionId = connection.id
        await sendMessageToClient(connectionId, payload)
    }

    return {
        statusCode: 200,
        body: ''
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

