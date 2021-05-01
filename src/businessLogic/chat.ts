import { Connection } from '@models/Connection'
import { ClientApi } from 'src/dataLayer/clientApi'
import { ConnectionsAccess } from 'src/dataLayer/connectionsAccess'
import { OnJoinRequest } from 'src/requests/onJoinRequest'
import { OnMessageActionInternal } from 'src/requests/onMessageAction'

const connectionsAccess = new ConnectionsAccess()
const clientApi = new ClientApi()

export async function broadcastMessageToRoom(request: OnMessageActionInternal) {
    const connections = await connectionsAccess.getByRoom(request.room)
    for (const connection of connections) {
        await clientApi.sendMessageToConnection(connection.connectionId, request)
    }
}

export async function joinRoom(connectionId: string, request: OnJoinRequest) {
    const connectionRequest: Connection = {
        connectionId,
        ...request
    }
    await connectionsAccess.joinRoom(connectionRequest)
}
