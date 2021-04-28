import { ApiGatewayManagementApi } from 'aws-sdk';
import { Message } from 'src/models/Message';
import { createApiGateway } from 'src/utils/apiGateway';
import { ErrorResponse } from '../responses/errorResponse';
import { createLogger } from '../utils/logger';
import { ConnectionsAccess } from './connectionsAccess';

const logger = createLogger('ClientApi')

export class ClientApi {
    constructor(
        private readonly apiGateway: ApiGatewayManagementApi = createApiGateway(),
        private readonly connectionsAccess = new ConnectionsAccess()
    ) { }

    async sendMessage(connectionId: string, payload: Message | ErrorResponse) {
        logger.info('sendMessageToClient', {
            connectionId,
            payload
        })

        await this.apiGateway.postToConnection({
            ConnectionId: connectionId,
            Data: JSON.stringify(payload)
        }).promise()

    }

    async sendMessageToUser(payload: Message | ErrorResponse, userId: string) {
        const connection = await this.connectionsAccess.getByUserId(userId)
        await this.sendMessage(connection.connectionId, payload)
    }
}
