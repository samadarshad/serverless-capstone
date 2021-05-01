import { ApiGatewayManagementApi } from 'aws-sdk';
import { StatusCodes } from 'http-status-codes';
import { OnMessageActionInternal } from 'src/requests/onMessageAction';
import { createApiGateway } from 'src/utils/apiGateway';
import { ErrorResponse } from '../responses/errorResponse';
import { createLogger } from '../utils/logger';

const logger = createLogger('ClientApi')

export class ClientApi {
    constructor(
        private readonly connectionId: string = '',
        private readonly apiGateway: ApiGatewayManagementApi = createApiGateway()
    ) { }

    async sendMessage(payload: OnMessageActionInternal | ErrorResponse) {
        logger.info('sendMessage', {
            connectionId: this.connectionId,
            payload
        })

        await this.apiGateway.postToConnection({
            ConnectionId: this.connectionId,
            Data: JSON.stringify(payload)
        }).promise()

    }

    async sendMessageToConnection(connectionId: string, payload: OnMessageActionInternal | ErrorResponse) {
        logger.info('sendMessageToConnection', {
            connectionId: connectionId,
            payload
        })

        await this.apiGateway.postToConnection({
            ConnectionId: connectionId,
            Data: JSON.stringify(payload)
        }).promise()
    }

    async ok() {
        await this.sendMessage({
            statusCode: StatusCodes.OK,
            body: ''
        })
        return
    }
}
