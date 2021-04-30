import { OnJoin } from '@models/onJoin'
import { ClientApi } from 'src/dataLayer/clientApi'
import { ConnectionsAccess } from 'src/dataLayer/connectionsAccess'
import { OnJoinRequest } from 'src/requests/onJoinRequest'
import { OnMessageActionInternal } from 'src/requests/onMessageAction'
import { SendMessageResponse } from 'src/responses/sendMessageResponse'
import { createLogger } from '../utils/logger'

const connectionsAccess = new ConnectionsAccess()
const clientApi = new ClientApi()
const logger = createLogger('chat')

export async function broadcastMessageToRoom(request: OnMessageActionInternal) {
    const { name, userId } = await connectionsAccess.getByConnectionId(request.connectionId)
    const payload: SendMessageResponse = {
        ...request,
        name,
        userId
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
