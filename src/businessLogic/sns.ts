import { OnMessageAction } from '@models/onMessageAction';
import 'source-map-support/register';
import { createSns } from 'src/utils/sns';

const sns = createSns()
const messagesTopicArn = process.env.MESSAGES_TOPIC_ARN

export async function publishMessageInternally(connectionId: string, request) {
    const payload: OnMessageAction = {
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
