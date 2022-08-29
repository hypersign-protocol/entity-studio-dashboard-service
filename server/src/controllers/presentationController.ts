import { Request, Response, NextFunction } from "express";
import HIDWallet from 'hid-hd-wallet'

import HypersignSsiSDK from "hs-ssi-sdk";
import { walletOptions, mnemonic } from '../config'
import PresentationTemplateSchema from "../models/presentationTemplateSchema";
const verifyPresentation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const hidWalletInstance = new HIDWallet(walletOptions);
        let hsSdk

        const { vc, issuerDid, holderDid } = req.body
        hidWalletInstance.generateWallet({ mnemonic }).then(async () => {
            hsSdk = new HypersignSsiSDK(hidWalletInstance.offlineSigner, walletOptions.hidNodeRPCUrl, walletOptions.hidNodeRestUrl)
            return hsSdk.init()
        }).then(async () => {
            console.log(req.body);

            return hsSdk.vp.verifyPresentation({
                signedPresentation: vc,
                challenge: vc.proof.challenge,
                domain: "https://localhos:20202",
                issuerDid,
                holderDid,
            })
        }).then(async (resut) => {
            console.log(resut);
            res.json(resut)
        })
    } catch (error) {
        res.status(500).json(error)
    }





}
const presentationTempalateById=async (req:Request,res:Response,next:NextFunction) => {
    try {
        const {data}=req.body.hypersign
        // const query_template={
        //     "domain": "tenant.vii.mattr.global",
        //     "name": "alumni_credential_request",
        //     "query": [
        //       {
        //         "type": "QueryByExample",
        //         "credentialQuery": [
        //           {
        //             "required": true,
        //             "reason": "We need you to prove your alumni membership.",
        //             "example": {
        //               "@context": [
        //                 "https://schema.org/"
        //               ],
        //               "type": "AlumniCredential",
        //               "trustedIssuer": [
        //                 {
        //                   "required": true,
        //                   "issuer": "didz6MkjBWPPa1njEKygyr3LR3pRKkqv714vyTkfnUdP6ToFSH5"
        //                 }
        //               ]
        //             }
        //           }
        //         ]
        //       }
        //     ]
        //   }
        const id=req.params.id
        const allTemplate= await PresentationTemplateSchema.findOne({templateOwnerDid:data.id ,_id:id})
        res.json(allTemplate)
    } catch (error) {
        res.status(500).json(error)
    }
}

const presentationTempalateAll= async (req: Request, res: Response, next: NextFunction) => {


    try {
        const {data}=req.body.hypersign
        const allTemplate= await PresentationTemplateSchema.find({templateOwnerDid:data.id})
        res.json(allTemplate)
    } catch (error) {
        res.status(500).json(error)
    }
}
const presentationTempalate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { queryType,
            domain,
            name,
            issuerDid,
            schemaId,
            reason,
            required,
            callbackUrl } = req.body
            const {data}=req.body.hypersign
            
        const presentationTemplateObj = await PresentationTemplateSchema.create({
            queryType,
            domain,
            name,
            issuerDid,
            schemaId,
            reason,
            required,
            callbackUrl,
            templateOwnerDid:data.id
        })

res.json(presentationTemplateObj)




    } catch (error) {
        res.status(500).json(error)
    }
}


export {
    verifyPresentation,presentationTempalate ,presentationTempalateAll,presentationTempalateById
}