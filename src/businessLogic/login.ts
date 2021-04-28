import { ConnectionsAccess } from 'src/dataLayer/connectionsAccess'
import { Connection } from 'src/models/Connection'

const connectionsAccess = new ConnectionsAccess()

export async function login(connectionId: string, userId: string):
    Promise<Connection> {
    const connection: Connection = {
        connectionId,
        userId,
        connectedAt: new Date().toISOString()
    }
    return await connectionsAccess.addConnection(connection)
}

export async function logout(connectionId: string) {
    await connectionsAccess.deleteConnection(connectionId)
}
