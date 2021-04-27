import { ApiGatewayManagementApi } from 'aws-sdk';
import { Message } from 'src/models/Message';
import { createApiGateway } from 'src/utils/apiGateway';
import { createLogger } from '../utils/logger';

const logger = createLogger('ClientApi')

export class ClientApi {
    constructor(
        private readonly apiGateway: ApiGatewayManagementApi = createApiGateway(),
    ) { }

    async sendMessage(connectionId, payload: Message) {
        logger.info('sendMessageToClient', {
            connectionId,
            payload
        })

        await this.apiGateway.postToConnection({
            ConnectionId: connectionId,
            Data: JSON.stringify(payload)
        }).promise()
    }
}
