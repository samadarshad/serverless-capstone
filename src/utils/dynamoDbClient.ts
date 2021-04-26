import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import * as AWSXRay from 'aws-xray-sdk'

export function createDynamoDBClient(): DocumentClient {
    if (process.env.IS_OFFLINE) {
        console.log('Creating a local DynamoDB instance')
        return new AWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    } else {
        const XAWS = AWSXRay.captureAWS(AWS)
        return new XAWS.DynamoDB.DocumentClient()
    }
}