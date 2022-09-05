import { Request, Response, NextFunction } from 'express';
import Schema, { ISchema } from '../models/Schema';
import { logger, sse_client, WALLET_WEBHOOK } from '../config'
const DELAY = 5000;
const STOP = 1000 * 60;
let timer = 0;

const saveSchema = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info("==========SchemaController ::saveSchema Starts ================")

        const { QR_DATA, hypersign } = req.body;
        const SchemaObj = await Schema.create({ did: hypersign.data.id, createdAt: new Date(), orgDid: QR_DATA.data.orgDid, status: "Initiated" })

        QR_DATA.serviceEndpoint = `${WALLET_WEBHOOK}/${SchemaObj._id}`;
        logger.info("==========SchemaController ::saveSchema Ends ================")

        res.status(200).json({ QR_DATA, schema: SchemaObj, status: 200 })

    } catch (error) {
        logger.error("==========SchemaController ::saveSchema Ends ================")
        res.status(500).json(error)
    }

}
const getSchemaById = async (req: Request, res: Response, next: NextFunction) => {
    try {

        logger.info("==========SchemaController ::getSchemaById Starts================")

        const id = req.params.id
        // const schema = await Schema.findOne({ _id: id }).exec()


        logger.info("==========SchemaController ::getSchemaById Ends================")
        res.setHeader('Access-Control-Allow-Origin', `${sse_client}`);
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader( 'Connection', 'keep-alive')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('X-Accel-Buffering', 'no')
        
        // res.json(schema)
        send(res, id)
    } catch (error) {
        logger.error("==========SchemaController ::getSchemaById Ends================")

        res.status(500).json(error)
    }
}
const send = async (res, id) => {
    try {
        timer = timer + DELAY;
        const schema: ISchema | null = await Schema.findOne({ _id: id }).exec()
        if (schema) {
            res.write(`data: ${JSON.stringify(schema)}\n\n`);

           
            if (schema.status === "Registered") {
                timer = 0;
                logger.info("==========SchemaController ::SSE Ends================")
                return 


            }
            if ((timer > STOP) || (timer === STOP)) {
                timer
                logger.info("==========SchemaController ::SSE Ends================")

                return 

            }
            setTimeout(() => { send(res, id) }, DELAY)
            
            return
        }
    } catch (error) {
        logger.error("==========SchemaController ::SSE Ends================")

        return res.end();
    }
}

const getSchema = async (req: Request, res: Response, next: NextFunction) => {
    try {

        logger.info("==========SchemaController ::getSchema Starts================")
        const Max_limit = 10
        const { hypersign } = req.body;
        const { page, limit } = req.query
        const orgDid = req.params.orgDid
        let limitInt = limit ? parseInt(limit.toString()) : Max_limit;
        if (limitInt > Max_limit) {
            limitInt = Max_limit;

        }
        const pageInt = page ? parseInt(page.toString()) : 1;
        const skip = (pageInt - 1) * limitInt;


        const schemaList = await Schema.find({ did: hypersign.data.id, orgDid ,status:"Registered"}).sort({ createdAt: -1 })
        logger.info("==========SchemaController ::getSchema Ends================")
        res.status(200).json({ schemaList, status: 200 })
    } catch (error) {
        logger.error("==========SchemaController ::getSchema Ends================")
        res.status(500).json(error)
    }

}

const setStatusSchema = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info("==========SchemaController ::setStatusSchema Starts================")

        const { transactionHash, schemaId, author } = req.body
        const id = req.params.id

        const schema = await Schema.findOneAndUpdate({ _id: id }, { transactionHash, schemaId, did: author, status: 'Registered' }).exec()
        logger.info("==========SchemaController ::setStatusSchema Ends================")
        res.json({ "msg": "Success" })
    } catch (error) {
        logger.error("==========SchemaController ::setStatusSchema Ends================")

        res.json({ "msg": "Faild" })
    }
}

export {
    saveSchema, setStatusSchema, getSchema, getSchemaById
}