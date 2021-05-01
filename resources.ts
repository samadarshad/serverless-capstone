export default {
    Resources: {
        'WebSocketConnectionsDynamoDBTable': {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
                AttributeDefinitions: [
                    {
                        AttributeName: 'connectionId',
                        AttributeType: 'S'
                    },
                    {
                        AttributeName: 'room',
                        AttributeType: 'S'
                    },
                ],
                KeySchema: [
                    {
                        AttributeName: 'connectionId',
                        KeyType: 'HASH'
                    }
                ],
                BillingMode: 'PAY_PER_REQUEST',
                TableName: "${self:provider.environment.CONNECTIONS_TABLE}",
                GlobalSecondaryIndexes: [
                    {
                        IndexName: "${self:provider.environment.ROOM_INDEX}",
                        KeySchema: [
                            {
                                AttributeName: 'room',
                                KeyType: 'HASH'
                            }
                        ],
                        Projection: {
                            ProjectionType: 'ALL'
                        }
                    }
                ]
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