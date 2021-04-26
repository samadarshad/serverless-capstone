import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'


const stage = process.env.STAGE
const apiId = process.env.API_ID
const region = process.env.REGION

export function createApiGateway() {
    if (process.env.IS_OFFLINE) {
        console.log('Creating a local ApiGateway instance')
        return new AWS.ApiGatewayManagementApi({
            region: 'localhost',
            apiVersion: "2018-11-29",
            endpoint: 'http://localhost:3001'
        })
    } else {
        const XAWS = AWSXRay.captureAWS(AWS)
        return new XAWS.ApiGatewayManagementApi({
            apiVersion: "2018-11-29",
            endpoint: `${apiId}.execute-api.${region}.amazonaws.com/${stage}`
        })
    }
}