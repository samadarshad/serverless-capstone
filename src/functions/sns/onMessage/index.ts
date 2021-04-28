import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  events: [
    {
      sns: {
        arn: "${self:custom.messagesTopicArn}"
      }
    }
  ],
  environment: {
    STAGE: "${self:provider.stage}",
    API_ID: {
      Ref: "WebsocketsApi"
    },
  },
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: [
        'dynamodb:Scan',
      ],
      Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.CONNECTIONS_TABLE}'
    },
    {
      Effect: 'Allow',
      Action: [
        'execute-api:*',
      ],
      Resource: '*'
    }
  ]

}
