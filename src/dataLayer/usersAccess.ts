import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { User } from '../models/User'
import { createDynamoDBClient } from '../utils/dynamoDbClient'
import { createLogger } from '../utils/logger'

const logger = createLogger('UserAccess')


export class UserAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly usersTable = process.env.USERS_TABLE,
        private readonly userIdIndex = process.env.USER_ID_INDEX
    ) { }

    async getByUserId(userId: string): Promise<User> {
        logger.info('getByUserId', {
            userId
        })

        const result = await this.docClient.query({
            TableName: this.usersTable,
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
            return item as User
        } else {
            return null
        }
    }

    async getUsers(room: string): Promise<User[]> {
        logger.info('getUsers', {
            room
        })

        const result = await this.docClient.query({
            TableName: this.usersTable,
            KeyConditionExpression: 'room = :room',
            ExpressionAttributeValues: {
                ':room': room
            }
        }).promise()

        const items = result.Items
        return items as User[]
    }

    async joinRoom(user: User): Promise<User> {
        logger.info('joinRoom', {
            user
        })

        await this.docClient.put({
            TableName: this.usersTable,
            Item: user
        }).promise()

        return user
    }


}
