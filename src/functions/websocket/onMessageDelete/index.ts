import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  events: [
    {
      websocket: {
        route: 'onMessageDelete',
        cors: true,
        request: {
          schema: {
            'application/json': '${file(models/on-message-request.json)}'
          }
        }
      }
    }
  ],
  environment: {
    STAGE: "${self:provider.stage}",
    API_ID: {
      Ref: "WebsocketsApi"
    },
    MESSAGES_TOPIC_ARN: "${self:custom.messagesTopicArn}",
  },
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: [
        'SNS:Publish',
      ],
      Resource: "${self:custom.messagesTopicArn}"
    },
  ]

}
