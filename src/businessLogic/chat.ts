import { ClientApi } from 'src/dataLayer/clientApi'
import { ConnectionsAccess } from 'src/dataLayer/connectionsAccess'
import { Message } from 'src/models/Message'
import { User } from 'src/models/User'
import { JoinRoomRequest } from 'src/requests/joinRoomRequest'
import { SendMessageRequest } from 'src/requests/sendMessageRequest'
import { UserAccess } from '../dataLayer/usersAccess'
import { createLogger } from '../utils/logger'


const userAccess = new UserAccess()
const connectionsAccess = new ConnectionsAccess()
const clientApi = new ClientApi()
const logger = createLogger('chat')

export async function broadcastMessageToRoom(request: SendMessageRequest, connectionId: string) {
    const connection = await connectionsAccess.getByConnectionId(connectionId)
    console.log("connection:", connection);

    const user: User = await userAccess.getByUserId(connection.userId)
    console.log("user", user);

    const payload: Message = {
        ...user,
        ...request,
        postedAt: new Date().toISOString()
    }

    const users = await userAccess.getUsers(user.room)
    console.log("users", users);

    for (const user of users) {
        sendMessageToUser(payload, user.userId)
    }
}

async function sendMessageToUser(payload: Message, userId: string) {
    const connection = await connectionsAccess.getByUserId(userId)
    await clientApi.sendMessage(connection.connectionId, payload)
}

export async function joinRoom(request: JoinRoomRequest, connectionId: string) {
    const user = await connectionsAccess.getByConnectionId(connectionId)

    const joiningUser: User = {
        ...user,
        ...request
    }

    await userAccess.joinRoom(joiningUser)
}
