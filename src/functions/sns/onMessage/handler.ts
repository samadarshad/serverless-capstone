import { OnMessageAction } from '@models/onMessageAction';
import { SNSEvent, SNSHandler } from 'aws-lambda';
import 'source-map-support/register';
import { broadcastMessageToRoom } from '../../../businessLogic/chat';


export const handler: SNSHandler = async (event: SNSEvent) => {
    const request: OnMessageAction = JSON.parse(event.Records[0].Sns.Message)
    console.log("action:", request.action);

    switch (request.action) {
        case "onMessage":
            await broadcastMessageToRoom(request)
            break
        case "onMessageDelete":
            console.log("need to delete msg");
            break
        default:
            console.log("action unknown");
            break
    }
}


