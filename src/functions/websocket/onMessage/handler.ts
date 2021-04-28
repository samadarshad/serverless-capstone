import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { validate } from 'jsonschema';
import 'source-map-support/register';
import { createSns } from 'src/utils/sns';
const sns = createSns()

const messagesTopicArn = process.env.MESSAGES_TOPIC_ARN



export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Websocket send message: ', event)
    console.log(messagesTopicArn);
    console.log("arn:aws:sns:eu-west-2:324941539183:messagesTopic-dev");

    const connectionId = event.requestContext.connectionId
    const timestamp = new Date().toISOString()
    const message = JSON.parse(event.body).message
    const room = JSON.parse(event.body).room

    const request = JSON.parse(event.body)
    // const request = {
    //     asd: "hi"
    // }
    console.log("req: ", request);


    var mySchema = {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "properties": {
            "message": {
                "type": "string"
            },
            "room": {
                "type": "string"
            }
        },
        "required": [
            "message",
            "room"
        ],
        "type": "object",
    }
    console.log(validate(request, mySchema).valid);

    // var schema2 = { "type": "number" };
    // console.log(validate("abc", schema2));




    // const payload = {
    //     connectionId,
    //     timestamp,
    //     message,
    //     room
    // }

    // await sns.publish({
    //     Message: JSON.stringify({
    //         default: JSON.stringify(payload)
    //     }),
    //     MessageStructure: "json",
    //     TopicArn: messagesTopicArn,
    // }).promise()

    // console.log("ping");

    return {
        statusCode: 200,
        body: ''
    }
}
