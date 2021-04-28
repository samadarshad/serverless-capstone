import { ApiGatewayManagementApi } from 'aws-sdk';
import { SendMessageResponse } from 'src/responses/sendMessageResponse';
import { createApiGateway } from 'src/utils/apiGateway';
import { ErrorResponse } from '../responses/errorResponse';
import { createLogger } from '../utils/logger';

const logger = createLogger('ClientApi')

export class ClientApi {
    constructor(
        private readonly apiGateway: ApiGatewayManagementApi = createApiGateway(),
    ) { }

    async sendMessage(connectionId: string, payload: SendMessageResponse | ErrorResponse) {
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
