import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import 'source-map-support/register';
import { joinRoom } from 'src/businessLogic/chat';
import { errorToHttp } from 'src/businessLogic/errors';
import { ClientApi } from 'src/dataLayer/clientApi';
import { createCheckers } from "ts-interface-checker";
import OnJoinRequestTI from "../../../requests/generated/onJoinRequest-ti";
const { OnJoinRequest: OnJoinRequestChecker } = createCheckers(OnJoinRequestTI)

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Websocket onJoin: ', event)
    const connectionId = event.requestContext.connectionId
    const request = JSON.parse(event.body)
    const clientApi = new ClientApi(connectionId)

    try {
        OnJoinRequestChecker.check(request)
    } catch (error) {
        await clientApi.sendMessage({
            statusCode: StatusCodes.BAD_REQUEST,
            body: error.message
        })
        return
    }

    try {
        await joinRoom(connectionId, request)
        return await clientApi.ok()
    } catch (error) {
        await clientApi.sendMessage(errorToHttp(error))
        return errorToHttp(error)
    }
}
