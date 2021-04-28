import { Message } from '@models/Message'
import { ClientApi } from 'src/dataLayer/clientApi'
import { ConnectionsAccess } from 'src/dataLayer/connectionsAccess'
import { JoinRoomRequest } from 'src/requests/joinRoomRequest'
import { OnJoinRequest } from 'src/requests/onJoinRequest'
import { SendMessageRequest } from 'src/requests/sendMessageRequest'
import { createLogger } from '../utils/logger'

const connectionsAccess = new ConnectionsAccess()
const clientApi = new ClientApi()
const logger = createLogger('chat')

export async function broadcastMessageToRoom(request: SendMessageRequest) {
    const name = await (await connectionsAccess.getByConnectionId(request.connectionId)).name

    const payload: Message = {
        name,
        ...request
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
