import { Request, Response, NextFunction } from "express";
import Team from "../models/TeamSchema";
import Org from '../models/OrgSchema';
const CreateOrg = async (req: Request, res: Response, next: NextFunction) => {


    try {
        const { orgData, hypersign } = req.body;
        const org = await new Org({ userDid: hypersign.data.id, orgDid: orgData.orgDid, region: orgData.region, name: orgData.name, domain: orgData.domain, logo: orgData.logo }).save()

        const team = await new Team({ orgDid: org._id, userDid: hypersign.data.id }).save()
        res.status(200).json({ org, status: 200 })

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
const updateOrg = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { orgData } = req.body;
        const org = await Org.findOneAndUpdate({ _id: orgData._id }, { orgDid: orgData.orgDid, region: orgData.region, name: orgData.name, domain: orgData.domain, logo: orgData.logo }).exec()
        res.status(200).json({ org, status: 200 })
    } catch (e) {
        res.status(500).send({ status: 500, message: null, error: e })
    }
}
export {
    CreateOrg, GetOrgById, GetOrgsByUserDid, deleteOrg, updateOrg
}