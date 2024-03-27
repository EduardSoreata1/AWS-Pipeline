import {DynamoDB} from "aws-sdk"

exports.handler = async() => {
    const ddbClient = new DynamoDB.DocumentClient;
    const params = {TableName: process.env.DYNAMODB!}
    const data = await ddbClient.scan(params).promise();

    return  {body: JSON.stringify(data)};
  };
