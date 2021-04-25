export default {
    Resources: {
        'WebSocketConnectionsDynamoDBTable': {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
                AttributeDefinitions: [
                    {
                        AttributeName: 'id',
                        AttributeType: 'S'
                    },
                ],
                KeySchema: [
                    {
                        AttributeName: 'id',
                        KeyType: 'HASH'
                    }
                ],
                BillingMode: 'PAY_PER_REQUEST',
                TableName: "${self:provider.environment.CONNECTIONS_TABLE}"
            }
        },
        'MessagesDynamoDBTable': {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
                AttributeDefinitions: [
                    {
                        AttributeName: 'id',
                        AttributeType: 'S'
                    },
                ],
                KeySchema: [
                    {
                        AttributeName: 'id',
                        KeyType: 'HASH'
                    }
                ],
                BillingMode: 'PAY_PER_REQUEST',
                TableName: "${self:provider.environment.MESSAGES_TABLE}"
            }
        },
        'GatewayResponseDefault4XX': {
            Type: 'AWS::ApiGateway::GatewayResponse',
            Properties: {
                ResponseParameters: {
                    'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
                    'gatewayresponse.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization'",
                    'gatewayresponse.header.Access-Control-Allow-Methods': "'GET,OPTIONS,POST'",
                },
                ResponseType: 'DEFAULT_4XX',
                RestApiId: { Ref: 'ApiGatewayRestApi' }
            }
        },
        'MessagesTopic': {
            Type: 'AWS::SNS::Topic',
            Properties: {
                DisplayName: 'Messages topic',
                TopicName: '${self:provider.environment.MESSAGES_TOPIC}'
            }
        }
    }
}