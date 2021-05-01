import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { StatusCodes } from 'http-status-codes'
import 'source-map-support/register'
import { logout } from 'src/businessLogic/login'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Websocket disconnect: ', event)

    const connectionId = event.requestContext.connectionId
    await logout(connectionId)

    return {
        statusCode: StatusCodes.OK,
        body: ''
    }
}

