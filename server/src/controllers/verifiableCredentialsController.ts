import { Request, Response, NextFunction } from 'express'
import { VerifiableCredentials } from '../services/vc.service';
import creadSchema from '../models/CreadSchema';
import { WALLET_WEB_HOOK_CREAD } from '../config'
const setCredentialStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
console.log(req.body);
const { issuerDid, subjectDid, schemaId }=req.body.vc

const credObj= await creadSchema.findOneAndUpdate({_id:id},{ vc:req.body.vc, vc_id:req.body.vc.credentialStatus.id, issuerDid, subjectDid, schemaId})

res.json({msg:"success"})
    } catch (error) {

    }
}
const issueCredential = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { QR_DATA, hypersign } = req.body
        const { issuerDid, subjectDid, schemaId } = QR_DATA.data
        QR_DATA.data.issuerDid = hypersign.data.id;

        const creadObj = await creadSchema.create({ issuerDid, subjectDid, schemaId, createdAt: new Date() })

        QR_DATA.data.expirationDate=new Date ('12/12/2027')
        QR_DATA.serviceEndpoint = `${WALLET_WEB_HOOK_CREAD}/${creadObj._id}`;
        console.log(QR_DATA);




        res.json({ QR_DATA, status: 200 })

    } catch (error) {
        res.json(error)
    }
}

// const issueCredential = async (req: Request, res: Response) => {
//     try{
//         // { subject = " ", id= "", issuer = " ", schemaId= " ", dataHash = " ", appId= " "}
//         const { id } =  res.locals.data;

//         const { subject, schemaId, dataHash, appId } = req.body;
//         // TODO: check all the params
//         const appObj = new VerifiableCredentials({ subject, schemaId, dataHash, appId, issuer: id});
//         const createdAppInDb: IVerifiableCredential = JSON.parse(await appObj.create())
//         // TODO: issue Vc
//         const vc = ""
//         res.status(200).send({ status: 200, message: createdAppInDb, error: null})
//     }catch(e){
//         res.status(500).send({ status: 500, message: null, error: e.message})
//     }
// }

const getCredentialList = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const {hypersign}=req.body
    const credList = await creadSchema.find({issuerDid:hypersign.data.id}).sort({ createdAt: -1 })
    res.json({
        credList,status:200
    })
  } catch (error) {
    
  }
}

export {
    issueCredential,
    getCredentialList,
    setCredentialStatus
}