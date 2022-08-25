import { Request, Response, NextFunction } from 'express';
import Schema from '../models/Schema';
import {WALLET_WEBHOOK} from '../config'


const saveSchema = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { QR_DATA, hypersign } = req.body;
        const SchemaObj = await Schema.create({ did: hypersign.data.id,  createdAt: new Date(), status: "Initiated" })

        QR_DATA.serviceEndpoint=`${WALLET_WEBHOOK}/${SchemaObj._id}`;
       
        console.log(SchemaObj);
        
        res.status(200).json({ QR_DATA, schema: SchemaObj, status: 200 })

    } catch (error) {
        res.status(500).json(error)
    }

}


const getSchema = async (req: Request, res: Response, next: NextFunction) => {
    try {


        const Max_limit = 10
        const { hypersign  } = req.body;
        const {page , limit} =req.query
        let limitInt = limit ? parseInt(limit.toString()) : Max_limit;
        if (limitInt > Max_limit) {
            limitInt = Max_limit;

        }
        const pageInt = page ? parseInt(page.toString()) : 1;
        const skip = (pageInt - 1) * limitInt;


        const schemaList = await Schema.find({}).sort({ createdAt: -1 }).skip(skip).limit( limitInt )
        res.status(200).json( {schemaList , status:200})
    } catch (error) {
        res.status(500).json(error)
    }

}

const setStatusSchema = async (req: Request, res: Response, next: NextFunction) => {
try {
    

const {transactionHash,schemaId,author}=req.body.result
const id=req.params.id

const schema= await Schema.findOneAndUpdate({_id:id},{transactionHash,schemaId,did:author,status:'Registered'}).exec()
console.log(schema);
res.json({"msg":"Success"})
} catch (error) {
    res.json({"msg":"Faild"})
}
}

export {
    saveSchema, setStatusSchema , getSchema
}