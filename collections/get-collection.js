'use strict';

const dynamodb = require('./dynamodb');

module.exports.getCollection = async (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  try {
    const result = await dynamodb.get(params).promise()
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Item ? result.Item : { message: "Not found!" }),
    };
    return response;

  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t fetch the item.',
    };
  }
};
