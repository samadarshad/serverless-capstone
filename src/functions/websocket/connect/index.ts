import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  events: [
    {
      websocket: {
        route: '$connect',
        cors: true
      }
    }
  ],
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: [
        'dynamodb:PutItem',
      ],
      Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.CONNECTIONS_TABLE}'
    }
  ]
}
