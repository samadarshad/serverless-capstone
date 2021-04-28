import { ConnectionsAccess } from 'src/dataLayer/connectionsAccess'
import { Connection } from 'src/models/Connection'
import { AddConnectionRequest } from 'src/requests/addConnectionRequest'

const connectionsAccess = new ConnectionsAccess()

export async function login(request: AddConnectionRequest):
    Promise<Connection> {
    const connection: Connection = {
        ...request,
        connectedAt: new Date().toISOString()
    }
    return await connectionsAccess.addConnection(connection)
}
