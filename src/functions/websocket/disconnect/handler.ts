import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { createDynamoDBClient } from 'src/utils/dynamoDbClient'

const docClient = createDynamoDBClient()

const connectionsTable = process.env.CONNECTIONS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Websocket disconnect: ', event)

    const connectionId = event.requestContext.connectionId

    const key = {
        connectionId
    }

    await docClient.delete({
        TableName: connectionsTable,
        Key: key
    }).promise()

    return {
        statusCode: 200,
        body: ''
    }
}

