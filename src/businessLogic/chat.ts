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

export async function broadcastMessageToRoom(request: SendMessageRequest) {
    const user: User = await userAccess.getByUserId(request.userId)
    console.log("user", user);

    const payload: Message = {
        ...user,
        ...request
    }

    const users = await userAccess.getUsers(user.room)
    console.log("users", users);

    for (const user of users) {
        clientApi.sendMessageToUser(payload, user.userId)
    }
}

export async function joinRoom(request: JoinRoomRequest) {
    const payload: User = {
        ...request
    }
    await userAccess.joinRoom(payload)
}
