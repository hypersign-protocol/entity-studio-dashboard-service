import env from 'dotenv';
import sqlite from 'sqlite3';
import path from 'path';
import fs from 'fs';
import hsdk from 'lds-sdk';

const log = require('simple-node-logger');

env.config();

const log_dir = path.resolve(__dirname, '../log');
const db_dir = path.resolve(__dirname, '../db');

if (!fs.existsSync(log_dir)) fs.mkdirSync(log_dir);
if (!fs.existsSync(db_dir)) fs.mkdirSync(db_dir);

// LOGGING
const log_path = path.resolve(__dirname, process.env.LOG_FILEPATH || 'ssi-infra.log');
const logger = log.createSimpleLogger({
  logFilePath: log_path,
  timestampFormat: process.env.LOG_TIMESTAMP_FORMAT || 'YYYY-MM-DD HH:mm:ss.SSS',
});
logger.setLevel(process.env.LOG_LEVEL || 'info');

const port = process.env.PORT || 5000;
const host = process.env.HOST || 'localhost';
const WALLET_WEBHOOK = `${process.env.STUDIO_SERVER_BASE_URL}api/v1/schema/status`;
const WALLET_WEB_HOOK_ORG_DID = `${process.env.STUDIO_SERVER_BASE_URL}api/v1/org/status`;
const WALLET_WEB_HOOK_CREAD = `${process.env.STUDIO_SERVER_BASE_URL}api/v1/credential/status`;
const ORG_SERVICE_ENDPOINT_GET_STATUS = `${process.env.STUDIO_SERVER_BASE_URL}api/v1/org`;
const bootstrapConfig = {
  keysfilePath: path.join(__dirname + '/keys.json'),
  schemafilePath: path.join(__dirname + '/schema.json'),
};

// DATABASE
// Ref: https://www.sqlitetutorial.net/sqlite-nodejs/
const db_file_path = process.env.DATABASE_FILEPATH || 'ssi.db';
const db_path = path.resolve(__dirname, db_file_path);
const db = new sqlite.Database(db_path, (err) => {
  if (err) {
    logger.error(`SQLite db error:  ${err.message}`);
  } else {
    logger.info(`Connected to ssi-infa database. DB path = ${db_path}`);
  }
});
const sse_client = process.env.SSE_CLIENT_URL;
// DID Related:
// TODO: Not required for this project. so remove
const did = {
  sheme: process.env.DID_SCHEME || 'did',
  method: process.env.DID_METHOD_NAME || 'hypersign',
};
const studioServerBaseUrl = process.env.STUDIO_SERVER_BASE_URL;
//Secrets
const jwtSecret = process.env.JWT_SECRET || 'secretKey';
const jwtExpiryInMilli = 240000;

const nodeServer = {
  baseURl: process.env.STUDIO_SERVER_BASE_URL || 'http://localhost:5000/',
  didCreateEp: process.env.NODE_SERVER_DID_CREATE_EP || 'api/did/create_tmp',
  schemaCreateEp: process.env.NODE_SERVER_SCHEMA_CREATE_EP || 'api/schema/create',
  schemaGetEp: process.env.NODE_SERVER_SCHEMA_GET_EP || 'api/schema/get',
};
const dbConnUrl =
  process.env.DB_URL && process.env.DB_URL != ''
    ? process.env.DB_URL
    : 'mongodb://admin:admin@cluster0-shard-00-00.jg0ef.mongodb.net:27017,cluster0-shard-00-01.jg0ef.mongodb.net:27017,cluster0-shard-00-02.jg0ef.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-n72avn-shard-0&authSource=admin&retryWrites=true&w=majority';
// DID Related:
const options = { nodeUrl: `${nodeServer.baseURl}`, didScheme: 'did:hs' };
const hypersignSDK = {
  did: hsdk.did(options),
  credential: hsdk.credential(options),
};

const mnemonic =
  'retreat seek south invite fall eager engage endorse inquiry sample salad evidence express actor hidden fence anchor crowd two now convince convince park bag';
const walletOptions = {
  hidNodeRPCUrl: process.env.HID_NETWORK_RPC || 'https://rpc.jagrat.hypersign.id/',
  hidNodeRestUrl: process.env.HID_NETWORK_API || 'https://api.jagrat.hypersign.id/',
};
const pathToIssueCred = process.env.PATH_TO_ISSUE_CRED;
const whitelistedCors = process.env.WHITELISTED_CORS || ['*'];
const schemaResolver =
  process.env.RPC_ENDPOINT || 'https://api.prajna.hypersign.id/hypersign-protocol/hidnode/ssi/schema/';
const schemaId = process.env.EMAIL_CREDENTITAL_SCHEMA_ID || "sch:hid:testnet:zufjU7LuQuJNFiUpuhCwYkTrakUu1VmtxE9SPi5TwfUB:1.0"
export {
  port,
  host,
  logger,
  db,
  did,
  jwtSecret,
  jwtExpiryInMilli,
  nodeServer,
  bootstrapConfig,
  hypersignSDK,
  dbConnUrl,
  WALLET_WEBHOOK,
  WALLET_WEB_HOOK_CREAD,
  WALLET_WEB_HOOK_ORG_DID,
  ORG_SERVICE_ENDPOINT_GET_STATUS,
  studioServerBaseUrl,
  pathToIssueCred,
  mnemonic,
  walletOptions,
  sse_client,
  whitelistedCors,
  schemaResolver,
  schemaId
};
