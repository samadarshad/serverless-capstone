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
                ],
                KeySchema: [
                    {
                        AttributeName: 'connectionId',
                        KeyType: 'HASH'
                    }
                ],
                BillingMode: 'PAY_PER_REQUEST',
                TableName: "${self:provider.environment.CONNECTIONS_TABLE}"
            }
        },
        'UsersDynamoDBTable': {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
                AttributeDefinitions: [
                    {
                        AttributeName: 'userId',
                        AttributeType: 'S'
                    },
                    {
                        AttributeName: 'room',
                        AttributeType: 'S'
                    },
                ],
                KeySchema: [
                    {
                        AttributeName: 'room',
                        KeyType: 'HASH'
                    },
                    {
                        AttributeName: 'userId',
                        KeyType: 'RANGE'
                    }
                ],
                BillingMode: 'PAY_PER_REQUEST',
                TableName: "${self:provider.environment.USERS_TABLE}",
                GlobalSecondaryIndexes: [
                    {
                        IndexName: "${self:provider.environment.USER_ID_INDEX}",
                        KeySchema: [
                            {
                                AttributeName: 'userId',
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
        'MessagesDynamoDBTable': {
            Type: 'AWS::DynamoDB::Table',
            Properties: {
                AttributeDefinitions: [
                    {
                        AttributeName: 'room',
                        AttributeType: 'S'
                    },
                    {
                        AttributeName: 'postedAt',
                        AttributeType: 'S'
                    },
                ],
                KeySchema: [
                    {
                        AttributeName: 'room',
                        KeyType: 'HASH'
                    },
                    {
                        AttributeName: 'postedAt',
                        KeyType: 'RANGE'
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