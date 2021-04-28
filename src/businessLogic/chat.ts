import { ClientApi } from 'src/dataLayer/clientApi'
import { ConnectionsAccess } from 'src/dataLayer/connectionsAccess'
import { JoinRoomRequest } from 'src/requests/joinRoomRequest'
import { OnJoinRequest } from 'src/requests/onJoinRequest'
import { SendMessageRequest } from 'src/requests/sendMessageRequest'
import { SendMessageResponse } from 'src/responses/sendMessageResponse'
import { createLogger } from '../utils/logger'

const connectionsAccess = new ConnectionsAccess()
const clientApi = new ClientApi()
const logger = createLogger('chat')

export async function broadcastMessageToRoom(request: SendMessageRequest) {
    const name = await (await connectionsAccess.getByConnectionId(request.connectionId)).name
    const { room, message, postedAt } = request
    const payload: SendMessageResponse = {
        name,
        room,
        message,
        postedAt
    }

    const connections = await connectionsAccess.getByRoom(request.room)

    for (const connection of connections) {
        await clientApi.sendMessage(connection.connectionId, payload)
    }
}

export async function joinRoom(connectionId: string, request: OnJoinRequest) {

    const joinRequest: JoinRoomRequest = {
        connectionId,
        ...request
    }

    await connectionsAccess.joinRoom(joinRequest)
}
