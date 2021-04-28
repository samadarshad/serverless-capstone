import { SNSEvent, SNSHandler } from 'aws-lambda';
import 'source-map-support/register';
import { SendMessageRequest } from 'src/requests/sendMessageRequest';
import { createApiGateway } from 'src/utils/apiGateway';
import { createDynamoDBClient } from 'src/utils/dynamoDbClient';
import { broadcastMessageToRoom } from '../../../businessLogic/chat';
const docClient = createDynamoDBClient()

const connectionsTable = process.env.CONNECTIONS_TABLE

const apiGateway = createApiGateway()

export const handler: SNSHandler = async (event: SNSEvent) => {
    const request: SendMessageRequest = JSON.parse(event.Records[0].Sns.Message)

    await broadcastMessageToRoom(request)
}


