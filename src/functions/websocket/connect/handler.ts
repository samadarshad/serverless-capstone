import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { verifyToken } from 'src/auth/utils'
import { errorToHttp } from 'src/businessLogic/errors'
import { login } from 'src/businessLogic/login'
import { ClientApi } from 'src/dataLayer/clientApi'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Websocket connect: ', event)
    const connectionId = event.requestContext.connectionId
    const clientApi = new ClientApi(connectionId)
    try {
        const jwtToken = await verifyToken(event.queryStringParameters.token)
        const userId = jwtToken.sub
        await login(connectionId, userId)
        await clientApi.ok()
        return
    } catch (error) {
        await clientApi.sendMessage(errorToHttp(error))
        return
    }
}

