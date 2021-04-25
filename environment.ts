export default {
    accountId: "324941539183",
    AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    CONNECTIONS_TABLE: "capstone-connections-${self:provider.stage}",
    API_ID: {
        Ref: "WebsocketsApi"
    },
    STAGE: "${self:provider.stage}",
    REGION: "${self:provider.region}",

    // for local only
    DISABLE_XRAY_TRACING: 'true',
    _X_AMZN_TRACE_ID: '0'
    //
}