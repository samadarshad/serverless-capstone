import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import 'source-map-support/register';
import { authorize } from 'src/businessLogic/auth';
import { errorToHttp } from 'src/businessLogic/errors';
import { publishMessageInternally } from 'src/businessLogic/sns';
import { ClientApi } from 'src/dataLayer/clientApi';
import { ConnectionsAccess } from 'src/dataLayer/connectionsAccess';
import { createCheckers } from "ts-interface-checker";
import OnMessageActionTI from "../../../requests/generated/onMessageAction-ti";
const { OnMessageAction: OnMessageActionChecker } = createCheckers(OnMessageActionTI)


const connectionsAccess = new ConnectionsAccess()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Websocket onMessage: ', event)
    const connectionId = event.requestContext.connectionId
    const request = JSON.parse(event.body)

    const clientApi = new ClientApi(connectionId)
    try {
        OnMessageActionChecker.check(request)
    } catch (error) {
        await clientApi.sendMessage({
            statusCode: StatusCodes.BAD_REQUEST,
            body: error.message
        })
        return
    }

    const userId = (await connectionsAccess.getByConnectionId(connectionId)).userId

    try {
        authorize(request, userId)
        await publishMessageInternally(userId, request)

        await clientApi.ok()
        return
    } catch (error) {
        await clientApi.sendMessage(errorToHttp(error))
        return
    }
}
