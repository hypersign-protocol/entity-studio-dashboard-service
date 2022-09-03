import { Request, Response, NextFunction } from "express";
import Team from "../models/TeamSchema";
import Org from '../models/OrgSchema';
import { logger, WALLET_WEB_HOOK_ORG_DID,ORG_SERVICE_ENDPOINT_GET_STATUS } from '../config'
import { Interface } from "readline";

const CreateOrg = async (req: Request, res: Response, next: NextFunction) => {


    try {
 
        const QrData = {
            QRType: "ISSUE_DID",
            serviceEndpoint: "",
            schemaId: "",
            appDid: "",
            appName: "Hypersign Studio",
            challenge: "",
            provider: "",
            data: {
                controllers:[""],        
                
               
                alsoKnownAs: "",
               
                
                serviceEndpoint: "",
            }

        }
        const { orgData, hypersign } = req.body;
        const org = await new Org({ userDid: hypersign.data.id, orgDid: orgData.orgDid, region: orgData.region, name: orgData.name, domain: orgData.domain, logo: orgData.logo ,status:'initiated' }).save()

        const team = await new Team({ orgDid: org._id, userDid: hypersign.data.id }).save()
        
        QrData.serviceEndpoint = `${WALLET_WEB_HOOK_ORG_DID}/${org._id}`
        QrData.data.controllers= [org.userDid]
       

        // QrData.data.region = org.region
        // QrData.data.name = org.name
        QrData.data.alsoKnownAs = org.domain
        // QrData.data.logo = org.logo
        // QrData.data.status = org.status
        QrData.data.serviceEndpoint=`${ORG_SERVICE_ENDPOINT_GET_STATUS}`

        console.log(QrData);
        
        res.status(200).json({ org, QrData, status: 200 })

    } catch (e) {
        res.status(500).send({ status: 500, message: null, error: e })
    }
}



const GetOrgById = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const orgDid = req.params.id;
        const org = await Org.find({ _id: orgDid }).exec()
        res.status(200).json({ org, status: 200 })

    } catch (e) {
        res.status(500).send({ status: 500, message: null, error: e })
    }
}
const GetOrgByDid =async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const org = await Org.findOne({ orgDid: id }).exec()
        res.status(200).json({ org, status: 200 })
    } catch (e) {
        res.status(500).send({ status: 500, message: null, error: e })
    }
}
const GetOrgsByUserDid = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { hypersign } = req.body;
        const org = await Org.find({ userDid: hypersign.data.id }).exec()
        res.status(200).json({ org, status: 200 })
    } catch (e) {
        res.status(500).send({ status: 500, message: null, error: e })
    }
}
const deleteOrg = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const org = await Org.findOneAndDelete({ _id: id }).exec()
        res.status(200).json({ org, status: 200 })
    } catch (e) {
        res.status(500).send({ status: 500, message: null, error: e })
    }
}
const GetOrgByIdSSE = async (req: Request, res: Response, next: NextFunction) => {

}
const updateOrg = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { orgData } = req.body;
        const org = await Org.findOneAndUpdate({ _id: orgData._id }, { orgDid: orgData.orgDid, region: orgData.region, name: orgData.name, domain: orgData.domain, logo: orgData.logo }).exec()
        res.status(200).json({ org, status: 200 })
    } catch (e) {
        res.status(500).send({ status: 500, message: null, error: e })
    }
}
const setOrgStatus =async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const { orgDid } = req.body;
        const org = await Org.findOneAndUpdate({ _id: id }, { status: "Registred" ,orgDid }).exec()
        res.status(200).json({ msg:"success", status: 200 })
    } catch (e) {
        res.status(500).send({ status: 500, message: null, error: e })
    }
}
export {
  GetOrgByDid,  CreateOrg, GetOrgById, GetOrgsByUserDid, deleteOrg, updateOrg,setOrgStatus,GetOrgByIdSSE
}