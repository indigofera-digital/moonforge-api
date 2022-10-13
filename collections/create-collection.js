'use strict';

const _ = require('lodash');
const uuid = require('uuid');
const dynamodb = require('./dynamodb');

module.exports.createCollection = async (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (typeof data.name !== 'string') {// || typeof data.pieces !== 'number') { // TODO validation check
    // check puzzlePieces * puzzleSize % openSize == 0
    console.error('Validation Failed');
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create collection.',
    };
  }

  // const piecesState = _.reduce(_.range(1, 1 + data.puzzlePieces), (obj, piece) => { obj[`piece${piece}Minted`] = 0; return obj; }, {});
  // const piecesPool = _.shuffle(_.flatten(_.range(1, 1 + data.puzzlePieces).map(p => _.fill(Array(data.puzzleSize), p))));
  const piecesTotal = data.puzzlePieces * data.puzzleSize;
  const mintedState = {
    // size: data.puzzleSize,
    piecesPool: _.range(piecesTotal),
    puzzlesPool: _.range(piecesTotal, piecesTotal + data.puzzleSize),
    // ...piecesState,
    // tokenIdCounter: 0,
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: data.address,
      address: data.address,
      puzzlePieces: data.puzzlePieces,
      puzzleSize: data.puzzleSize,
      openSize: data.openSize,
      royaltyFee: data.royaltyFee,
      feeCollectorAddress: data.feeCollectorAddress,
      name: data.name,
      description: data.description,
      collectionBaseUrl: data.collectionBaseUrl,
      collectionImageUrl: data.collectionImageUrl,
      createdAt: timestamp,
      mintedState: mintedState
    },
  };

  try {
    await dynamodb.put(params).promise()
    return {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create the collection.',
    };
  }
};
