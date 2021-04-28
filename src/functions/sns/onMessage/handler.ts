import { SNSEvent, SNSHandler } from 'aws-lambda';
import 'source-map-support/register';
import { OnMessageAction } from 'src/requests/onMessageAction';
import { broadcastMessageToRoom } from '../../../businessLogic/chat';


export const handler: SNSHandler = async (event: SNSEvent) => {
    const request: OnMessageAction = JSON.parse(event.Records[0].Sns.Message)

    await broadcastMessageToRoom(request)
}


