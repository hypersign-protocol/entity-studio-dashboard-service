import { Request, Response, NextFunction } from 'express';
import Schema from '../models/Schema';
import { logger, WALLET_WEBHOOK } from '../config'


const saveSchema = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info("==========SchemaController ::saveSchema Starts ================")

        const { QR_DATA, hypersign } = req.body;
        const SchemaObj = await Schema.create({ did: hypersign.data.id, createdAt: new Date(), status: "Initiated" })

        QR_DATA.serviceEndpoint = `${WALLET_WEBHOOK}/${SchemaObj._id}`;
        logger.info("==========SchemaController ::saveSchema Ends ================")

        res.status(200).json({ QR_DATA, schema: SchemaObj, status: 200 })

    } catch (error) {
        logger.error("==========SchemaController ::saveSchema Ends ================")
        res.status(500).json(error)
    }

}


const getSchema = async (req: Request, res: Response, next: NextFunction) => {
    try {

logger.info("==========SchemaController ::getSchema Starts================")
        const Max_limit = 10
        const { hypersign } = req.body;
        const { page, limit } = req.query
        let limitInt = limit ? parseInt(limit.toString()) : Max_limit;
        if (limitInt > Max_limit) {
            limitInt = Max_limit;

        }
        const pageInt = page ? parseInt(page.toString()) : 1;
        const skip = (pageInt - 1) * limitInt;


        const schemaList = await Schema.find({ did: hypersign.data.id }).sort({ createdAt: -1 }).skip(skip).limit(limitInt)
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
    saveSchema, setStatusSchema, getSchema
}