import { OnMessage } from '@models/onMessage';
import { SNSEvent, SNSHandler } from 'aws-lambda';
import 'source-map-support/register';
import { broadcastMessageToRoom } from '../../../businessLogic/chat';


export const handler: SNSHandler = async (event: SNSEvent) => {
    const request: OnMessage = JSON.parse(event.Records[0].Sns.Message)

    await broadcastMessageToRoom(request)
}


