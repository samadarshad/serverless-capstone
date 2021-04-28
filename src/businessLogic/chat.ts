import { OnJoin } from '@models/onJoin'
import { OnMessage } from '@models/onMessage'
import { ClientApi } from 'src/dataLayer/clientApi'
import { ConnectionsAccess } from 'src/dataLayer/connectionsAccess'
import { OnJoinRequest } from 'src/requests/onJoinRequest'
import { SendMessageResponse } from 'src/responses/sendMessageResponse'
import { createLogger } from '../utils/logger'

const connectionsAccess = new ConnectionsAccess()
const clientApi = new ClientApi()
const logger = createLogger('chat')

export async function broadcastMessageToRoom(request: OnMessage) {
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

    const join: OnJoin = {
        connectionId,
        ...request
    }

    await connectionsAccess.joinRoom(join)
}
