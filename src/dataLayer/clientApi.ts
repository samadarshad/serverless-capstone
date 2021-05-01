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
        private readonly connectionId: string = 'NO_CONNECTION_ID',
        private readonly apiGateway: ApiGatewayManagementApi = createApiGateway(),
        private readonly connectionsAccess = new ConnectionsAccess()
    ) { }

    async sendMessage(payload: OnMessageActionInternal | ErrorResponse) {
        this.sendMessageToConnection(this.connectionId, payload)
    }

    async sendMessageToConnection(inputConnectionId: string, payload: OnMessageActionInternal | ErrorResponse) {
        logger.info('sendMessageToConnection', {
            connectionId: inputConnectionId,
            payload
        })

        try {
            await this.apiGateway.postToConnection({
                ConnectionId: inputConnectionId,
                Data: JSON.stringify(payload)
            }).promise()
        } catch (error) {
            console.log('Failed to send message', JSON.stringify(error));
            if (error.statusCode === 410) {
                console.log('Stale connection');
                await this.connectionsAccess.deleteConnection(inputConnectionId)
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
