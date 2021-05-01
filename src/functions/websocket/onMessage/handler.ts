import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import 'source-map-support/register';
import { errorToHttp } from 'src/businessLogic/errors';
import { publishMessageInternally } from 'src/businessLogic/sns';
import { ClientApi } from 'src/dataLayer/clientApi';
import { ConnectionsAccess } from 'src/dataLayer/connectionsAccess';
import { OnMessageAction } from 'src/requests/onMessageAction';
import { createCheckers } from "ts-interface-checker";
import OnMessageActionTI from "../../../requests/generated/onMessageAction-ti";
const { OnMessageAction: OnMessageActionChecker } = createCheckers(OnMessageActionTI)

const clientApi = new ClientApi()
const connectionsAccess = new ConnectionsAccess()
const requiresAuthorization = (request: OnMessageAction) => request.postedAt ? true : false

const userIsAuthorized = async (userId: string, request: OnMessageAction) => {
    return (request.userId === userId)
}

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Websocket onMessage: ', event)
    const connectionId = event.requestContext.connectionId
    const request = JSON.parse(event.body)

    try {
        OnMessageActionChecker.check(request)
    } catch (error) {
        await clientApi.sendMessage(connectionId, {
            statusCode: StatusCodes.BAD_REQUEST,
            body: error.message
        })
        return
    }

    const userId = (await connectionsAccess.getByConnectionId(connectionId)).userId

    if (requiresAuthorization(request) && ! await userIsAuthorized(userId, request)) {
        await clientApi.sendMessage(connectionId, {
            statusCode: StatusCodes.UNAUTHORIZED,
            body: ReasonPhrases.UNAUTHORIZED
        })
        return
    }

    try {
        await publishMessageInternally(userId, request)
    } catch (error) {
        await clientApi.sendMessage(connectionId, errorToHttp(error))
        return
    }

    await clientApi.sendMessage(connectionId, {
        statusCode: StatusCodes.OK,
        body: ''
    })

    return
}
