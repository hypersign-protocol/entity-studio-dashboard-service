import { Request, Response, NextFunction } from 'express';
import Team from '../models/TeamSchema';
import Org, { IOrg } from '../models/OrgSchema';
import SchemaModel from '../models/Schema';
import presentationModel from '../models/presentationTemplateSchema';
import credentialModel from '../models/CreadSchema';
import { logger, WALLET_WEB_HOOK_ORG_DID, ORG_SERVICE_ENDPOINT_GET_STATUS, sse_client } from '../config';
import { send } from '../services/sse';
import ApiResonse from '../response/apiResponse';
import PresentationTemplate from '../models/presentationTemplateSchema';
import Schema from '../models/Schema';

const CreateOrg = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('OrgCtrl:: CreateOrg() method start...');
    const QrData = {
      QRType: 'ISSUE_DID',
      serviceEndpoint: '',
      schemaId: '',
      appDid: '',
      appName: 'Hypersign Studio',
      challenge: '',
      provider: '',
      data: {
        controllers: [''],

        alsoKnownAs: '',

        serviceEndpoint: '',
      },
    };
    const { orgData, hypersign } = req.body;
    const org: IOrg = await new Org({
      userDid: hypersign.data.id,
      orgDid: orgData.orgDid,
      controller: orgData.controller,
      region: orgData.region,
      name: orgData.name,
      domain: orgData.domain,
      logo: orgData.logo,
      status: 'Initiated',
    }).save();

    const team = await new Team({ orgDid: org._id, userDid: hypersign.data.id }).save();

    QrData.serviceEndpoint = `${WALLET_WEB_HOOK_ORG_DID}/${org._id}`;
    QrData.data.controllers = org.controller;

    // QrData.data.region = org.region
    // QrData.data.name = org.name
    QrData.data.alsoKnownAs = org.domain;
    // QrData.data.logo = org.logo
    // QrData.data.status = org.status
    QrData.data.serviceEndpoint = `${ORG_SERVICE_ENDPOINT_GET_STATUS}`;
    logger.info('OrgCtrl:: CreateOrg() method ends...');
    return next(ApiResonse.success({ org, QrData }));
  } catch (e) {
    logger.error('OrgCtrl:: CreateOrg(): Error ' + e);
    return next(ApiResonse.internal(null, e));
  }
};

const GetOrgById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgDid = req.params.id;
    const org = await Org.find({ _id: orgDid }).exec();
    res.status(200).json({ org, status: 200 });
  } catch (e) {
    res.status(500).send({ status: 500, message: null, error: e });
  }
};
const GetOrgByDid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const org = await Org.findOne({ orgDid: id }).exec();
    res.status(200).json({ org, status: 200 });
  } catch (e) {
    res.status(500).send({ status: 500, message: null, error: e });
  }
};
const GetOrgsByUserDid = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('OrgCtrl:: GetOrgsByUserDid() method start...');
    const { hypersign } = req.body;
    const org: Array<IOrg> = await Org.find({ controller: { $all:[hypersign.data.id]}}).exec();
    const tempOrgList: Array<IOrg> = [];
    for (let i = 0; i < org.length; i++) {
      const tempOrg: IOrg = org[i];
      const schemasCount = await SchemaModel.countDocuments({ orgDid: tempOrg._id });
      const templatesCount = await presentationModel.countDocuments({ orgDid: tempOrg._id });
      const credentialsCount = await credentialModel.countDocuments({ orgDid: tempOrg._id });
      tempOrg.schemasCount = schemasCount;
      tempOrg.templatesCount = templatesCount;
      tempOrg.credentialsCount = credentialsCount;
      tempOrgList.push({ ...tempOrg['_doc'] });
    }
    logger.info('OrgCtrl:: GetOrgsByUserDid() method ends...');
    return next(ApiResonse.success({ org: tempOrgList }));
  } catch (e) {
    logger.error('OrgCtrl:: GetOrgsByUserDid(): Error ' + e);
    return next(ApiResonse.internal(null, e));
  }
};
const deleteOrg = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const org = await Org.findOneAndDelete({ _id: id }).exec();
    res.status(200).json({ org, status: 200 });
  } catch (e) {
    res.status(500).send({ status: 500, message: null, error: e });
  }
};
const GetOrgByIdSSE = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const timer = 0;
    const DELAY = 5000;
    const STOP = 5000 * 60;
    const id = req.params.id;
    res.setHeader('Access-Control-Allow-Origin', `${sse_client}`);
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-Accel-Buffering', 'no');
    send(res, OrgById, id, timer, DELAY, STOP, 'OrgController', orgStatusByid);
  } catch (e) {
    res.status(500).send({ status: 500, message: null, error: e });
  }
};
const OrgById = async (id) => {
  const org = await Org.findOne({ _id: id }).exec();
  return org;
};
const orgStatusByid = async (id) => {
  return await Org.findOneAndUpdate({ _id: id }, { status: 'Failed' }, { returnDocument: 'after' }).exec();
};
const updateOrg = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const QrData = {
      QRType: 'UPDATE_DID',
      serviceEndpoint: '',
      schemaId: '',
      appDid: '',
      appName: 'Hypersign Studio',
      challenge: '',
      provider: '',
      data: {
        controllers: [''],
        orgDid: '',
        alsoKnownAs: '',

        serviceEndpoint: '',
      },
    };
    logger.info('orgCtrl:: updateOrg() method start...');
    const { orgData } = req.body;
    let org;
    try {
      org = await Org.findOneAndUpdate(
        { _id: orgData._id },
        {
          orgDid: orgData.orgDid,
          region: orgData.region,
          name: orgData.name,
          domain: orgData.domain,
          logo: orgData.logo,
          controller: orgData.controller,
          
        },
        { returnDocument: 'after' }
      ).exec();
      if (!org) return next(ApiResonse.badRequest(null, `No org detail exists for orgId ${orgData._id}`));
    } catch (e) {
      logger.error('orgCtrl:: updateOrg() : Error', e);
      return next(ApiResonse.badRequest(null, 'Invalid orgId'));
    }
    logger.info('OrgCtrl:: updating domain of presentation template');
    await PresentationTemplate.updateMany({ orgDid: orgData._id }, { domain: orgData.domain }, { multi: true });
    logger.info('orgCtrl:: updateOrg() method end...');

    
    QrData.serviceEndpoint = `${WALLET_WEB_HOOK_ORG_DID}/${orgData._id}`;
    QrData.data.controllers = org.controller;

    // QrData.data.region = org.region
    // QrData.data.name = org.name
    QrData.data.alsoKnownAs = org.domain;
    QrData.data.orgDid = org.orgDid;
    // QrData.data.logo = org.logo
    // QrData.data.status = org.status
    QrData.data.serviceEndpoint = `${ORG_SERVICE_ENDPOINT_GET_STATUS}`;
    return next(ApiResonse.success({ org , QrData}));
  } catch (e) {
    logger.error('orgCtrl:: updateOrg() : Error', e);

    return next(ApiResonse.internal(null, e));
  }
};
const setOrgStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const { orgDid } = req.body;

    const org = await Org.findOneAndUpdate({ _id: id }, { status: 'Registered', orgDid }).exec();

    res.status(200).json({ msg: 'success', status: 200 });
  } catch (e) {
    res.status(500).send({ status: 500, message: null, error: e });
  }
};
export { GetOrgByDid, CreateOrg, GetOrgById, GetOrgsByUserDid, deleteOrg, updateOrg, GetOrgByIdSSE, setOrgStatus };
