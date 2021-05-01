import 'source-map-support/register';
import { OnMessageAction, OnMessageActionInternal } from 'src/requests/onMessageAction';
import { createSns } from 'src/utils/sns';

const sns = createSns()
const messagesTopicArn = process.env.MESSAGES_TOPIC_ARN

export async function publishMessageInternally(connectionId: string, request: OnMessageAction) {
    let payload: OnMessageActionInternal
    const timestamp = new Date().toISOString()
    if (!request.postedAt) {
        // new message        
        payload = {
            ...request,
            connectionId,
            postedAt: timestamp,
            modifiedAt: timestamp
        }
    } else {
        // edit message
        payload = {
            ...request,
            connectionId,
            modifiedAt: timestamp
        }
    }

    await sns.publish({
        Message: JSON.stringify({
            default: JSON.stringify(payload)
        }),
        MessageStructure: "json",
        TopicArn: messagesTopicArn,
    }).promise()
}

