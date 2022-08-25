import { Request, Response, NextFunction } from 'express'
import { VerifiableCredentials } from '../services/vc.service';
import creadSchema from '../models/CreadSchema';
import { WALLET_WEB_HOOK_CREAD } from '../config'
const setCredentialStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id

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

const getCredentialList = async (req: Request, res: Response) => {
    console.log(res.locals.data);
    // const { name } = req.body;
    const { id } = res.locals.data;
    if (!id) throw new Error('UserId is required!');
    const appObj = new VerifiableCredentials({ issuer: id });
    const list = await appObj.fetch()
    res.status(200).send({
        status: 200, message: {
            count: list.length,
            list
        }, error: null
    })
}

export {
    issueCredential,
    getCredentialList,
    setCredentialStatus
}