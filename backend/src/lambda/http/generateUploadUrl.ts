import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk';
import 'source-map-support/register'

const bucketName = process.env.bucketName;
const awsRegion = process.env.AWS_REGION;
const expirationTime = 2 * parseInt(process.env.SIGNED_URL_EXPIRATION);


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  console.log('todoId: ', todoId);

  const s3 = new AWS.S3({
    signatureVersion: 'v4',
    region: awsRegion,
    params: {Bucket: bucketName}
  });

  const url = s3.getSignedUrl('getObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: expirationTime
  });

  const responseBody = {
    todoId,
    url
  }
  
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  return {
    statusCode: 200,
    body: JSON.stringify(responseBody)
  };
}


