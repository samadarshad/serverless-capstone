import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  events: [
    {
      sns: {
        arn: 'arn:aws:sns:eu-west-2:324941539183:messagesTopic-dev',
        topicName: "messagesTopic-dev",
      }
    }
  ],
  environment: {
    STAGE: "${self:provider.stage}",
    API_ID: {
      Ref: "WebsocketsApi"
    },
  },

}