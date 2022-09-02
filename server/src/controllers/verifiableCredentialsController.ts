import { Request, Response, NextFunction } from 'express'
import { jwtExpiryInMilli, jwtSecret, pathToIssueCred, studioServerBaseUrl, logger } from '../config';
import jwt from 'jsonwebtoken'
import creadSchema from '../models/CreadSchema';
import { WALLET_WEB_HOOK_CREAD } from '../config'
const setCredentialStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info("==========CredController ::setCredentialStatus Starts ================")
        const id = req.params.id
        const { issuerDid, subjectDid, schemaId } = req.body.vc

        const credObj = await creadSchema.findOneAndUpdate({ _id: id }, { vc: req.body.vc, vc_id: req.body.vc.credentialStatus.id, issuerDid, subjectDid, schemaId })
        logger.info("==========CredController ::setCredentialStatus Ends ================")

        res.json({ msg: "success" })
    } catch (error) {
        logger.error("==========CredController ::setCredentialStatus Starts ================")

        res.json(error)
    }
}
const issueCredential = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info("==========CredController ::issueCredential Starts ================")

        const { QR_DATA, hypersign } = req.body
        const { issuerDid, subjectDid, schemaId ,orgDid } = QR_DATA.data
        QR_DATA.data.issuerDid = hypersign.data.id;

        const creadObj = await creadSchema.create({ issuerDid, subjectDid, schemaId, createdAt: new Date() ,orgDid})

        QR_DATA.data.expirationDate = new Date('12/12/2027')
        QR_DATA.serviceEndpoint = `${WALLET_WEB_HOOK_CREAD}/${creadObj._id}`;



        logger.info("==========CredController ::issueCredential Ends ================")

        res.json({ QR_DATA, status: 200 })

    } catch (error) {
        logger.error("==========CredController ::issueCredential Ends ================")

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

const getCredentialList = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info("==========CredController ::getCredentialList Starts ================")

        const { hypersign } = req.body
        const orgDid = req.params.orgDid
        const credList = await creadSchema.find({ issuerDid: hypersign.data.id ,orgDid }).sort({ createdAt: -1 })
        logger.info("==========CredController ::getCredentialList Ends ================")

        res.json({
            credList, status: 200
        })
    } catch (error) {

    }
}

const accepctCredential = async (req: Request, res: Response, next: NextFunction) => {

    try {
        logger.info("==========CredController ::accepctCredential Starts ================")

        const dbRowId = req.body.id

        const data = {
            id: dbRowId
        }


        const issuedJWTToken = await jwt.sign(data, jwtSecret, { expiresIn: jwtExpiryInMilli })


        const link = `${studioServerBaseUrl}${pathToIssueCred}?token=${issuedJWTToken}`

        const QRData = JSON.stringify({
            QRType: 'ISSUE_CRED',
            url: link // This url user will eventually call from the wallet to fetch vc from studio server
        });




        const deeplink = `${studioServerBaseUrl}deeplink.html?deeplink=hypersign:deeplink?url=${QRData}`

        logger.info("==========CredController ::accepctCredential Ends ================")

        res.json({ url: deeplink })

    } catch (error) {
        logger.Error("==========CredController ::accepctCredential Ends ================")

        res.status(500).json({ error })
    }

}

const accpctWalletCredential = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info("==========CredController ::accpctWalletCredential Starts ================")

        let vc_data;
        const { token, did } = req.query
        if (token) {
            jwt.verify(token, jwtSecret, async (err, data) => {
                if (err) res.status(403).send({ status: 403, message: "Unauthorized.", error: null })

                const dbId = data.id
                vc_data = await creadSchema.findOne({ _id: dbId })
                res.json(vc_data.vc)

                logger.info("==========CredController ::accpctWalletCredential Ends ================")

            })
        }



    } catch (error) {
        logger.error("==========CredController ::accpctWalletCredential Ends ================")

        res.status(500).json(error)
    }
}
export {
    issueCredential,
    getCredentialList,
    setCredentialStatus, accepctCredential, accpctWalletCredential
}