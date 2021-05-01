import 'source-map-support/register';
import { OnMessageAction, OnMessageActionInternal } from 'src/requests/onMessageAction';
import { createSns } from 'src/utils/sns';

const sns = createSns()
const messagesTopicArn = process.env.MESSAGES_TOPIC_ARN

export async function publishMessageInternally(userId: string, request: OnMessageAction) {
    let payload: OnMessageActionInternal
    const timestamp = new Date().toISOString()
    if (!request.postedAt) {
        // new message        
        payload = {
            ...request,
            userId,
            postedAt: timestamp,
            modifiedAt: timestamp
        }
    } else {
        // edit message
        payload = {
            ...request,
            userId,
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

