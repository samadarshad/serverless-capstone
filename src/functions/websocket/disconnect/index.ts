import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  events: [
    {
      websocket: {
        route: '$disconnect',
        cors: true
      }
    }
  ],
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: [
        'dynamodb:DeleteItem',
      ],
      Resource: 'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.CONNECTIONS_TABLE}'
    }
  ]
}
