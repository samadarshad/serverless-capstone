import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Connection } from '../models/Connection'
import { createDynamoDBClient } from '../utils/dynamoDbClient'
import { createLogger } from '../utils/logger'

const logger = createLogger('ConnectionsAccess')


export class ConnectionsAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly connectionsTable = process.env.CONNECTIONS_TABLE,
        private readonly userIdIndex = process.env.USER_ID_INDEX,
        private readonly roomIndex = process.env.ROOM_INDEX

    ) { }

    async getByConnectionId(connectionId: string): Promise<Connection | null> {
        logger.info('getByConnectionId', {
            connectionId
        })

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

    async deleteConnection(connectionId: string) {
        logger.info('deleteConnection', {
            connectionId
        })

        await this.docClient.delete({
            TableName: this.connectionsTable,
            Key: {
                connectionId
            }
        }).promise()

        return
    }

    async getByRoom(room: string): Promise<Connection[]> {
        logger.info('getByRoom', {
            room
        })

        const result = await this.docClient.query({
            TableName: this.connectionsTable,
            IndexName: this.roomIndex,
            KeyConditionExpression: 'room = :room',
            ExpressionAttributeValues: {
                ':room': room
            }
        }).promise()

        const items = result.Items
        return items as Connection[]
    }

    async joinRoom(connection: Connection): Promise<Connection> {
        logger.info('joinRoom', {
            connection
        })

        await this.docClient.update({
            TableName: this.connectionsTable,
            Key: {
                connectionId: connection.connectionId
            },
            ExpressionAttributeNames: {
                '#user_name': 'name'
            },
            UpdateExpression: "set #user_name = :name, room = :room",
            ExpressionAttributeValues: {
                ":name": connection.name,
                ":room": connection.room
            }
        }).promise()

        return connection
    }


}
