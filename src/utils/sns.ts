import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)
const region = process.env.REGION

export function createSns() {
    if (process.env.IS_OFFLINE) {
        console.log('Creating a local SNS instance')
        return new XAWS.SNS({
            region: 'localhost',
            endpoint: 'http://localhost:4002'
        })
    }

    return new XAWS.ApiGatewayManagementApi({
        region
    })
}