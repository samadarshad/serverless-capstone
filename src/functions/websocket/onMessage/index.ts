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
    MESSAGES_TOPIC_ARN: "arn:aws:sns:eu-west-2:324941539183:messagesTopic-dev",
  },
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: [
        'SNS:Publish',
      ],
      Resource: "arn:aws:sns:eu-west-2:324941539183:messagesTopic-dev"
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
