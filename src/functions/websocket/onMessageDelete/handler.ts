import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import 'source-map-support/register';
import { errorToHttp } from 'src/businessLogic/errors';
import { publishMessageInternally } from 'src/businessLogic/sns';
import { ClientApi } from 'src/dataLayer/clientApi';
import { createCheckers } from "ts-interface-checker";
import OnMessageDeleteRequestTI from "../../../requests/generated/onMessageDeleteRequest-ti";
const { OnMessageDeleteRequest: OnMessageDeleteRequestChecker } = createCheckers(OnMessageDeleteRequestTI)

const clientApi = new ClientApi()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Websocket onMessageDelete: ', event)
    const connectionId = event.requestContext.connectionId
    const request = JSON.parse(event.body)

    try {
        OnMessageDeleteRequestChecker.check(request)
    } catch (error) {
        await clientApi.sendMessage(connectionId, {
            statusCode: StatusCodes.BAD_REQUEST,
            body: error.message
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
