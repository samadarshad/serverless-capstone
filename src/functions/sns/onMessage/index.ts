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
        'dynamodb:Query',
        'dynamodb:DeleteItem'
      ],
      Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.CONNECTIONS_TABLE}'
    },
    {
      Effect: 'Allow',
      Action: [
        'dynamodb:Query'
      ],
      Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.CONNECTIONS_TABLE}/index/${self:provider.environment.ROOM_INDEX}'
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
