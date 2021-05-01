import 'source-map-support/register';
import { OnMessageAction, OnMessageActionInternal } from 'src/requests/onMessageAction';
import { createSns } from 'src/utils/sns';

const sns = createSns()
const messagesTopicArn = process.env.MESSAGES_TOPIC_ARN

const createPayload = (request, userId): string => {
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

    return payload
}

export async function publishMessageInternally(userId: string, request: OnMessageAction) {
    const payload = createPayload(request, userId)

    await sns.publish({
        Message: JSON.stringify({
            default: JSON.stringify(payload)
        }),
        MessageStructure: "json",
        TopicArn: messagesTopicArn,
    }).promise()
}

