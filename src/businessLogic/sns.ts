import 'source-map-support/register';
import { OnMessageRequest } from 'src/requests/onMessageRequest';
import { SendMessageRequest } from 'src/requests/sendMessageRequest';
import { createSns } from 'src/utils/sns';

const sns = createSns()
const messagesTopicArn = process.env.MESSAGES_TOPIC_ARN

export async function publishMessage(connectionId: string, request: OnMessageRequest) {
    const payload: SendMessageRequest = {
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
