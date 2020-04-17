import * as AWS from 'aws-sdk';

const databaseEndpoint = process.env.LOCAL_DATABASE_ENDPOINT;
const databasePort = process.env.LOCAL_DATABASE_PORT;

export default function dbClient() : AWS.DynamoDB.DocumentClient{
    if(process.env.OFFLINE){
        const databaseURL = `${databaseEndpoint}:${databasePort}`;
        return new AWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: databaseURL
        });
    }
    return new AWS.DynamoDB.DocumentClient();
}