import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import 'source-map-support/register';
import { joinRoom } from 'src/businessLogic/chat';
import { errorToHttp } from 'src/businessLogic/errors';
import { ClientApi } from 'src/dataLayer/clientApi';
import { ConnectionsAccess } from 'src/dataLayer/connectionsAccess';
import { JoinRoomRequest } from 'src/requests/joinRoomRequest';
import { createDynamoDBClient } from 'src/utils/dynamoDbClient';
import { createCheckers } from "ts-interface-checker";
import OnJoinRequestTI from "../../../requests/generated/onJoinRequest-ti";
const { OnJoinRequest } = createCheckers(OnJoinRequestTI)

const docClient = createDynamoDBClient()

const connectionsTable = process.env.CONNECTIONS_TABLE
const clientApi = new ClientApi()
const connectionsAccess = new ConnectionsAccess()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Websocket onJoin: ', event)
    const connectionId = event.requestContext.connectionId
    const request = JSON.parse(event.body)

    try {
        OnJoinRequest.check(request)
    } catch (error) {
        await clientApi.sendMessage(connectionId, {
            statusCode: StatusCodes.BAD_REQUEST,
            body: error.message
        })
        return
    }

    try {
        const user = await connectionsAccess.getByConnectionId(connectionId)

        const joinRequest: JoinRoomRequest = {
            ...request,
            ...user
        }
        await joinRoom(joinRequest)
    } catch (error) {
        await clientApi.sendMessage(connectionId, errorToHttp(error))
        return
    }

    // const request: JoinRoomRequest = {
    //     name,
    //     room,
    //     connectionId
    // }
    // await joinRoom(request)

    // const payload = {
    //     connectionId,
    //     timestamp,
    //     name,
    //     room
    // }

    // console.log("joiner", payload);


    // await docClient.update({
    //     TableName: connectionsTable,
    //     Key: {
    //         connectionId,
    //     },
    //     ExpressionAttributeNames: {
    //         '#user_name': 'name'
    //     },
    //     UpdateExpression: "set #user_name = :name, room = :room",
    //     ExpressionAttributeValues: {
    //         ":name": name,
    //         ":room": room,
    //     }
    // }).promise()

    await clientApi.sendMessage(connectionId, {
        statusCode: StatusCodes.OK,
        body: ''
    })

    return
}
