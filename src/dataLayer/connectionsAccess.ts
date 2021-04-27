import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Connection } from '../models/Connection'
import { createDynamoDBClient } from '../utils/dynamoDbClient'
import { createLogger } from '../utils/logger'

const logger = createLogger('ConnectionsAccess')


export class ConnectionsAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly connectionsTable = process.env.CONNECTIONS_TABLE,
        private readonly userIdIndex = process.env.USER_ID_INDEX
    ) { }

    async getByUserId(userId: string): Promise<Connection | null> {
        logger.info('getByUserId', {
            userId
        })

        const result = await this.docClient.query({
            TableName: this.connectionsTable,
            IndexName: this.userIdIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()
        logger.info('result', {
            result
        })

        if (result.Count !== 0) {
            const item = result.Items[0]
            return item as Connection
        } else {
            return null
        }
    }

    async getByConnectionId(connectionId: string): Promise<Connection | null> {
        logger.info('getByConnectionId', {
            connectionId
        })

        console.log("getting user from connectionId: ", connectionId);
        const result = await this.docClient.query({
            TableName: this.connectionsTable,
            KeyConditionExpression: 'connectionId = :connectionId',
            ExpressionAttributeValues: {
                ':connectionId': connectionId
            }
        }).promise()
        logger.info('result', {
            result
        })

        if (result.Count !== 0) {
            const item = result.Items[0]
            return item as Connection
        } else {
            return null
        }
    }

    async addConnection(connection: Connection): Promise<Connection> {
        logger.info('addConnection', {
            connection
        })

        await this.docClient.put({
            TableName: this.connectionsTable,
            Item: connection
        }).promise()

        return connection
    }


}
