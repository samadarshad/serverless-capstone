import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  events: [
    {
      websocket: {
        route: 'onMessage',
        cors: true
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
        'dynamodb:Query',
        'dynamodb:DeleteItem'
      ],
      Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.CONNECTIONS_TABLE}'
    },
    {
      Effect: 'Allow',
      Action: [
        'SNS:Publish',
      ],
      Resource: "${self:custom.messagesTopicArn}"
    },
    {
      Action: [
        'execute-api:*'
      ],
      Effect: 'Allow',
      Resource: '*'
    }
  ]

}
