import { ClientApi } from 'src/dataLayer/clientApi'
import { ConnectionsAccess } from 'src/dataLayer/connectionsAccess'
import { Connection } from 'src/models/Connection'
import { AddConnectionRequest } from 'src/requests/addConnectionRequest'
import { UserAccess } from '../dataLayer/usersAccess'
import { createLogger } from '../utils/logger'


const userAccess = new UserAccess()
const connectionsAccess = new ConnectionsAccess()
const clientApi = new ClientApi()
const logger = createLogger('login')

export async function login(request: AddConnectionRequest):
    Promise<Connection> {
    const connection: Connection = {
        ...request,
        connectedAt: new Date().toISOString()
    }
    return await connectionsAccess.addConnection(connection)
}
