
import type { AWS } from '@serverless/typescript';
import environment from 'environment';
import functions from 'functions';
import plugins from 'plugins';
import resources from 'resources';

const serverlessConfiguration: AWS = {
  service: 'serverless-capstone',
  app: 'serverless-capstone',
  org: 'samadarshad',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    'serverless-offline': {
      httpPort: 3003
    },
    dynamodb: {
      start: {
        port: 8000,
        inMemory: true,
        migrate: true
      },
      stages: [
        'dev'
      ]
    },
    'serverless-offline-sns': {
      port: 4002,
      debug: false,
      accountId: 324941539183
    },
    messagesTopicArn: "arn:aws:sns:${self:provider.region}:${self:provider.environment.accountId}:${self:provider.environment.MESSAGES_TOPIC}",
    deploytime: "${file(./gettime.js)}"
  },
  plugins,
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    // @ts-ignore
    region: "${opt:region, 'eu-west-2'}",
    stage: "${opt:stage, 'dev'}",
    environment,
    lambdaHashingVersion: '20201221',
    tracing: {
      lambda: true,
      apiGateway: true
    },
  },
  // import the function via paths
  functions,
  resources
};

module.exports = serverlessConfiguration;
