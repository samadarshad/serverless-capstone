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
        'MessagesTopic': {
            Type: 'AWS::SNS::Topic',
            Properties: {
                DisplayName: 'Messages topic',
                TopicName: '${self:provider.environment.MESSAGES_TOPIC}'
            }
        }
    }
}