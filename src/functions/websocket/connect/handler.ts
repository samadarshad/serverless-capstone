import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { login } from 'src/businessLogic/login'
import { AddConnectionRequest } from 'src/requests/addConnectionRequest'
import { createDynamoDBClient } from 'src/utils/dynamoDbClient'
const docClient = createDynamoDBClient()

const connectionsTable = process.env.CONNECTIONS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Websocket connect: ', event)

    const connectionId = event.requestContext.connectionId

    //TODO authenticate user and get userId from token https://codeburst.io/how-to-build-a-react-chat-app-with-aws-api-gateway-websockets-and-cognito-custom-authorizer-6f84f2da47ec
    const userId = event.queryStringParameters.token

    const addConnectionRequest: AddConnectionRequest = {
        connectionId,
        userId
    }

    await login(addConnectionRequest)
    // const timestamp = new Date().toISOString()

    // const item = {
    //     connectionId,
    //     timestamp
    // }

    // await docClient.put({
    //     TableName: connectionsTable,
    //     Item: item
    // }).promise()

    return {
        statusCode: 200,
        body: ''
    }
}

