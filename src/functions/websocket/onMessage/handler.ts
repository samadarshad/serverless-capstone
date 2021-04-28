import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import 'source-map-support/register';
import { errorToHttp } from 'src/businessLogic/errors';
import { ClientApi } from 'src/dataLayer/clientApi';
import { ConnectionsAccess } from 'src/dataLayer/connectionsAccess';
import { SendMessageRequest } from 'src/requests/sendMessageRequest';
import { createSns } from 'src/utils/sns';
import { createCheckers } from "ts-interface-checker";
import OnMessageRequestTI from "../../../requests/generated/onMessageRequest-ti";
const { OnMessageRequest } = createCheckers(OnMessageRequestTI)

const sns = createSns()
const messagesTopicArn = process.env.MESSAGES_TOPIC_ARN

const clientApi = new ClientApi()
const connectionsAccess = new ConnectionsAccess()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Websocket onMessage: ', event)
    const connectionId = event.requestContext.connectionId
    const request = JSON.parse(event.body)

    try {
        OnMessageRequest.check(request)
    } catch (error) {
        await clientApi.sendMessage(connectionId, {
            statusCode: StatusCodes.BAD_REQUEST,
            body: error.message
        })
        return
    }

    try {
        const user = await connectionsAccess.getByConnectionId(connectionId)

        const payload: SendMessageRequest = {
            ...request,
            ...user,
            postedAt: new Date().toISOString(),
        }

        await sns.publish({
            Message: JSON.stringify({
                default: JSON.stringify(payload)
            }),
            MessageStructure: "json",
            TopicArn: messagesTopicArn,
        }).promise()
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
