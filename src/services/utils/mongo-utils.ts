import * as esprima from 'esprima';

const ObjectId = require('mongodb').ObjectId;

/** @class */
export class MongoUtils {
  public static isObjectId(id) {
    return id instanceof ObjectId;
  }

  public static isLocalHost(host) {
    return host === 'localhost' || host === '127.0.0.1';
  }

  public static isBracketNotation(expression) {
    let astTokens = esprima.tokenize(expression);

    if (!astTokens || astTokens.length < 3) return false;
    if (astTokens[0].value !== 'db') return false;

    return astTokens[1].value === '[';
  }
}

