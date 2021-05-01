import { ApiGatewayManagementApi } from 'aws-sdk';
import { StatusCodes } from 'http-status-codes';
import { OnMessageActionInternal } from 'src/requests/onMessageAction';
import { createApiGateway } from 'src/utils/apiGateway';
import { ErrorResponse } from '../responses/errorResponse';
import { createLogger } from '../utils/logger';
import { ConnectionsAccess } from './connectionsAccess';

const logger = createLogger('ClientApi')

export class ClientApi {
    constructor(
        private readonly connectionId: string = '',
        private readonly apiGateway: ApiGatewayManagementApi = createApiGateway(),
        private readonly connectionsAccess = new ConnectionsAccess()
    ) { }

    async sendMessage(payload: OnMessageActionInternal | ErrorResponse) {
        this.sendMessageToConnection(this.connectionId, payload)
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

        try {
            await this.apiGateway.postToConnection({
                ConnectionId: this.connectionId,
                Data: JSON.stringify(payload)
            }).promise()
        } catch (error) {
            console.log('Failed to send message', JSON.stringify(error));
            if (error.statusCode === 410) {
                console.log('Stale connection');
                await this.connectionsAccess.deleteConnection(this.connectionId)
            }
        }
    }

    async ok() {
        const response = {
            statusCode: StatusCodes.OK,
            body: ''
        }
        await this.sendMessage(response)
        return response
    }
}
