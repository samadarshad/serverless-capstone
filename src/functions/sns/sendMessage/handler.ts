import { SNSEvent, SNSHandler } from 'aws-lambda';
import 'source-map-support/register';
import { SendMessageRequest } from 'src/requests/sendMessageRequest';
import { broadcastMessageToRoom } from '../../../businessLogic/chat';


export const handler: SNSHandler = async (event: SNSEvent) => {
    const request: SendMessageRequest = JSON.parse(event.Records[0].Sns.Message)

    await broadcastMessageToRoom(request)
}


