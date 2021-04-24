import hello from '@functions/hello';
import type { AWS } from '@serverless/typescript';
import environment from 'environment';
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
    }
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
  },
  // import the function via paths
  functions: { hello },
  resources
};

module.exports = serverlessConfiguration;
