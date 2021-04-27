import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { createDynamoDBClient } from 'src/utils/dynamoDbClient'

const docClient = createDynamoDBClient()

const connectionsTable = process.env.CONNECTIONS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Websocket send message: ', event)

    const connectionId = event.requestContext.connectionId
    const timestamp = new Date().toISOString()
    const { name, room } = JSON.parse(event.body)

    const payload = {
        connectionId,
        timestamp,
        name,
        room
    }

    console.log("joiner", payload);

    await docClient.update({
        TableName: connectionsTable,
        Key: {
            id: connectionId,
        },
        ExpressionAttributeNames: {
            '#user_name': 'name'
        },
        UpdateExpression: "set #user_name = :name, room = :room",
        ExpressionAttributeValues: {
            ":name": name,
            ":room": room,
        }
    }).promise()

    return {
        statusCode: 200,
        body: ''
    }
}
