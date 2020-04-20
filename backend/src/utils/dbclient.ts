import * as AWSXRay from 'aws-xray-sdk-core';
import * as AWS from 'aws-sdk';
import { DynamoDB } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';



const databaseEndpoint = process.env.LOCAL_DATABASE_ENDPOINT;
const databasePort = process.env.LOCAL_DATABASE_PORT;


export const databaseConnection = () : AWS.DynamoDB.DocumentClient => {
    let client: DocumentClient;
    client = new AWS.DynamoDB.DocumentClient();

    if(process.env.RUNNING_OFFLINE){
        const databaseURL = `${databaseEndpoint}:${databasePort}`;
        client = new DocumentClient({
            service: new DynamoDB({
                region: 'localhost',
                endpoint: databaseURL
            })
        });
        AWSXRay.captureAWSClient((client as any).service);
        return client;
    }
    return client;
}