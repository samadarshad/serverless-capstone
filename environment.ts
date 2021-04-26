export default {
    accountId: "324941539183",
    AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    CONNECTIONS_TABLE: "capstone-connections-${self:provider.stage}",
    MESSAGES_TABLE: "capstone-messages-${self:provider.stage}",
    API_ID: {
        Ref: "WebsocketsApi"
    },
    STAGE: "${self:provider.stage}",
    REGION: "${self:provider.region}",
    MESSAGES_TOPIC: "messagesTopic-${self:provider.stage}",
}