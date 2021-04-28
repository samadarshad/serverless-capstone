import { OnMessage } from '@models/onMessage';
import 'source-map-support/register';
import { OnMessageRequest } from 'src/requests/onMessageRequest';
import { createSns } from 'src/utils/sns';

const sns = createSns()
const messagesTopicArn = process.env.MESSAGES_TOPIC_ARN

export async function publishMessageInternally(connectionId: string, request: OnMessageRequest) {
    const payload: OnMessage = {
        ...request,
        connectionId,
        postedAt: new Date().toISOString(),
    }

    await sns.publish({
        Message: JSON.stringify({
            default: JSON.stringify(payload)
        }),
        MessageStructure: "json",
        TopicArn: messagesTopicArn,
    }).promise()
}
