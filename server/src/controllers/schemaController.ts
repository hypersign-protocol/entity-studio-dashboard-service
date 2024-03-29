import { Request, Response, NextFunction } from 'express';
import Schema, { ISchema } from '../models/Schema';
import { logger, sse_client, WALLET_WEBHOOK } from '../config';
import { send } from '../services/sse';
import ApiResonse from '../response/apiResponse';

const saveSchema = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('==========SchemaController ::saveSchema Starts ================');

    const { QR_DATA, hypersign } = req.body;
    const SchemaObj = await Schema.create({
      did: hypersign.data.id,
      createdAt: new Date(),
      primaryDid: hypersign.data.id,
      orgDid: QR_DATA.data.orgDid,
      status: 'Initiated',
    });

    QR_DATA.serviceEndpoint = `${WALLET_WEBHOOK}/${SchemaObj._id}`;
    logger.info('==========SchemaController ::saveSchema Ends ================');
    return next(ApiResonse.success({ QR_DATA, schema: SchemaObj }));
  } catch (error) {
    logger.error('==========SchemaController ::saveSchema Ends ================');
    logger.error('SchemaCtrl:: saveSchema() Error: ' + error);
    return next(ApiResonse.internal(null, error));
  }
};
const getSchemaById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const timer = 0;
    const DELAY = 5000;
    const STOP = 5000 * 60;
    logger.info('==========SchemaController ::getSchemaById Starts================');

    const id = req.params.id;
    logger.info('==========SchemaController ::getSchemaById Ends================');
    res.setHeader('Access-Control-Allow-Origin', `${sse_client}`);
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-Accel-Buffering', 'no');

    // res.json(schema)
    send(res, getSchemaData, id, timer, DELAY, STOP, 'SchemaController');
  } catch (error) {
    logger.error('==========SchemaController ::getSchemaById Ends================');

    res.status(500).json(error);
  }
};

const getSchemaData = async (id) => {
  const schema: ISchema | null = await Schema.findOne({ _id: id }).exec();
  return schema;
};

const getSchema = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('==========SchemaController ::getSchema Starts================');
    const Max_limit = 10;
    const { hypersign } = req.body;
    const { page, limit } = req.query;
    const orgDid = req.params.orgDid;
    let limitInt = limit ? parseInt(limit.toString()) : Max_limit;
    if (limitInt > Max_limit) {
      limitInt = Max_limit;
    }
    const pageInt = page ? parseInt(page.toString()) : 1;
    const skip = (pageInt - 1) * limitInt;
    const schemaList = await Schema.find({ orgDid }).sort({ createdAt: -1 }).skip(skip).limit(limitInt);
    logger.info('==========SchemaController ::getSchema Ends================');
    return next(ApiResonse.success({ schemaList }));
  } catch (error) {
    logger.error('==========SchemaController ::getSchema Ends================');
    logger.error('SchemaCtrl:: getSchema() Error: ' + error);
    return next(ApiResonse.internal(null, error));
  }
};

const setStatusSchema = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('==========SchemaController ::setStatusSchema Starts================');

    const { transactionHash, schemaId, author } = req.body;
    const id = req.params.id;

    const schema = await Schema.findOneAndUpdate(
      { _id: id },
      { transactionHash, schemaId, did: author, status: 'Registered' }
    ).exec();
    logger.info('==========SchemaController ::setStatusSchema Ends================');
    res.json({ msg: 'Success' });
  } catch (error) {
    logger.error('==========SchemaController ::setStatusSchema Ends================');

    res.json({ msg: 'Faild' });
  }
};

export { saveSchema, setStatusSchema, getSchema, getSchemaById };
