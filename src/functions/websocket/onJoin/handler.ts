import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import 'source-map-support/register';
import { joinRoom } from 'src/businessLogic/chat';
import { errorToHttp } from 'src/businessLogic/errors';
import { ClientApi } from 'src/dataLayer/clientApi';
import { createCheckers } from "ts-interface-checker";
import OnJoinRequestTI from "../../../requests/generated/onJoinRequest-ti";
const { OnJoinRequest: OnJoinRequestChecker } = createCheckers(OnJoinRequestTI)

const clientApi = new ClientApi()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Websocket onJoin: ', event)
    const connectionId = event.requestContext.connectionId
    const request = JSON.parse(event.body)

    try {
        OnJoinRequestChecker.check(request)
    } catch (error) {
        await clientApi.sendMessage(connectionId, {
            statusCode: StatusCodes.BAD_REQUEST,
            body: error.message
        })
        return
    }

    try {
        await joinRoom(connectionId, request)
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
