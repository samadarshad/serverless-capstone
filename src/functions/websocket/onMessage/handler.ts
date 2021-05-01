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

const userIsAuthorized = async (connectionId: string, request: OnMessageAction) => {
    const connection = await connectionsAccess.getByConnectionId(connectionId)
    const user = connection.userId
    return (request.userId === user)
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

    if (requiresAuthorization(request) && ! await userIsAuthorized(connectionId, request)) {
        await clientApi.sendMessage(connectionId, {
            statusCode: StatusCodes.UNAUTHORIZED,
            body: ReasonPhrases.UNAUTHORIZED
        })
        return
    }

    try {
        await publishMessageInternally(connectionId, request)
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
