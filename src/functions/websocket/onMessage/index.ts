import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  events: [
    {
      websocket: {
        route: 'sendMessage'
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
    {
      Effect: 'Allow',
      Action: [
        'dynamodb:Scan',
      ],
      Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.CONNECTIONS_TABLE}'
    }
  ]

}
