import { Connection } from '@models/Connection'
import { ClientApi } from 'src/dataLayer/clientApi'
import { ConnectionsAccess } from 'src/dataLayer/connectionsAccess'
import { Message } from 'src/models/Message'
import { JoinRoomRequest } from 'src/requests/joinRoomRequest'
import { OnJoinRequest } from 'src/requests/onJoinRequest'
import { SendMessageRequest } from 'src/requests/sendMessageRequest'
import { createLogger } from '../utils/logger'

const connectionsAccess = new ConnectionsAccess()
const clientApi = new ClientApi()
const logger = createLogger('chat')

export async function broadcastMessageToRoom(request: SendMessageRequest) {
    const connection: Connection = await connectionsAccess.getByConnectionId(request.connectionId)
    console.log("connection", connection);

    const payload: Message = {
        ...connection,
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
