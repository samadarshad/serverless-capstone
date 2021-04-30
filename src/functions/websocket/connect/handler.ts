import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { verifyToken } from 'src/auth/utils'
import { login } from 'src/businessLogic/login'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Websocket connect: ', event)
    const connectionId = event.requestContext.connectionId
    try {
        const jwtToken = await verifyToken(event.queryStringParameters.token)
        const userId = jwtToken.sub
        await login(connectionId, userId)
        return {
            statusCode: 200,
            body: ''
        }
    } catch (error) {
        console.log("failed login");
    }
}

