import { SNSEvent, SNSHandler } from 'aws-lambda';
import 'source-map-support/register';
import { OnMessageActionInternal } from 'src/requests/onMessageAction';
import { broadcastMessageToRoom } from '../../../businessLogic/chat';


export const handler: SNSHandler = async (event: SNSEvent) => {
    const request: OnMessageActionInternal = JSON.parse(event.Records[0].Sns.Message)
    console.log('Sns onMessage: ', request)

    await broadcastMessageToRoom(request)
}


