import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk';
import 'source-map-support/register'

const bucketName = process.env.IMAGES_BUCKET_NAME;
const appRegion = process.env.APP_REGION;
const expirationTime = parseInt(process.env.SIGNED_URL_EXPIRATION);

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  console.log('todoId: ', todoId);

  const s3 = new AWS.S3({
    signatureVersion: 'v4',
    region: appRegion,
    params: {Bucket: bucketName}
  });

  const url = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: expirationTime
  });

  const responseBody = {
    todoId,
    url
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify(responseBody)
  };
}


