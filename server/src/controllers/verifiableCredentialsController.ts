import { Request, Response, NextFunction } from 'express';
import { jwtExpiryInMilli, jwtSecret, pathToIssueCred, studioServerBaseUrl, logger, sse_client } from '../config';
import jwt from 'jsonwebtoken';
import creadSchema, { ICreadSchema } from '../models/CreadSchema';
import { WALLET_WEB_HOOK_CREAD } from '../config';
import { send } from '../services/sse';
import ApiResponse from '../response/apiResponse';
import { urlSanitizer } from '../utils/fields';

const setCredentialStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('==========CredController ::setCredentialStatus Starts ================');

    const id = req.params.id;
    if (!req.body.credStatus) {
      const { issuerDid, subjectDid, schemaId } = req.body.vc;
      const credObj = await creadSchema.findOneAndUpdate(
        { _id: id },
        {
          vc: req.body.vc,
          vc_id: req.body.vc.credentialStatus.id,
          issuerDid,
          subjectDid,
          schemaId,
          status: 'Registered',
        }
      );
    } else {
      const { transactionHash, credStatus } = req.body;
      await creadSchema.findOneAndUpdate(
        { _id: id },
        {
          status: credStatus.claim.currentStatus,
          transactionHash,
        }
      );
    }

    logger.info('==========CredController ::setCredentialStatus Ends ================');

    res.json({ msg: 'success' });
  } catch (error) {
    logger.error('==========CredController ::setCredentialStatus Starts ================');

    res.json(error);
  }
};
const getCredentialById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const timer = 0;
    const DELAY = 5000;
    const STOP = 5000 * 60;
    logger.info('==========CredController ::getCredentialById Starts ================');

    const id = req.params.id;
    logger.info('==========CredController ::getCredentialById Ends ================');

    res.setHeader('Access-Control-Allow-Origin', `${sse_client}`);
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-Accel-Buffering', 'no');
    send(res, getCread, id, timer, DELAY, STOP, 'CredController');

    //  res.json(cred)
  } catch (error) {
    logger.error('==========CredController ::getCredentialById Ends ================');

    res.status(500).json(error);
  }
};

const getCread = async (id) => {
  return await creadSchema.findOne({ _id: id });
};

const issueCredential = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('==========CredController ::issueCredential Starts ================');

    const { QR_DATA, hypersign } = req.body;
    const { issuerDid, subjectDid, schemaId, orgDid, expiryDate } = QR_DATA.data;
    QR_DATA.data.issuerDid = hypersign.data.id;

    const creadObj = await creadSchema.create({
      issuerDid,
      subjectDid,
      schemaId,
      status: 'Initiated',
      createdAt: new Date(),
      orgDid,
      expiryDate,
    });

    QR_DATA.data.expirationDate = new Date(expiryDate);
    QR_DATA.serviceEndpoint = `${WALLET_WEB_HOOK_CREAD}/${creadObj._id}`;

    logger.info('==========CredController ::issueCredential Ends ================');
    return next(ApiResponse.success({ QR_DATA, creadRecord: creadObj }));
  } catch (error) {
    logger.error('==========CredController ::issueCredential Ends ================');
    logger.error('CredController ::issueCredential : Error ' + error);
    return next(ApiResponse.internal(null, error));
  }
};

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
    logger.info('==========CredController ::getCredentialList Starts ================');

    const { hypersign } = req.body;
    const orgDid = req.params.orgDid;
    const credList = await creadSchema.find({ issuerDid: hypersign.data.id, orgDid }).sort({ createdAt: -1 });
    logger.info('==========CredController ::getCredentialList Ends ================');
    return next(ApiResponse.success({ credList }));
  } catch (error) {
    logger.error('CredController ::issueCredential : Error ' + error);
    return next(ApiResponse.internal(null, error));
  }
};

const sendCredentialDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('==========CredController ::sendCredentialDetail Starts ================');

    const dbRowId = req.body.id;

    const data = {
      id: dbRowId,
    };

    const issuedJWTToken = await jwt.sign(data, jwtSecret, { expiresIn: jwtExpiryInMilli });

    const link = `${urlSanitizer(studioServerBaseUrl, true)}${pathToIssueCred}?token=${issuedJWTToken}`;

    const QRData = JSON.stringify({
      QRType: 'ISSUE_CRED',
      url: link, // This url user will eventually call from the wallet to fetch vc from studio server
    });

    const deeplink = `${urlSanitizer(
      studioServerBaseUrl,
      true
    )}deeplink.html?deeplink=hypersign:deeplink?url=${QRData}`;

    logger.info('==========CredController ::sendCredentialDetail Ends ================');
    return next(ApiResponse.success({ url: deeplink }));
  } catch (error) {
    logger.Error('==========CredController ::sendCredentialDetail Ends ================');
    logger.error('CredController ::sendCredentialDetail: Error', error);
    res.status(500).json({ error });
  }
};

const acceptCredentials = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('==========CredController ::acceptCredentials Starts ================');

    let vc_data;
    const { token, did } = req.query;
    if (token) {
      jwt.verify(token, jwtSecret, async (err, data) => {
        if (err) res.status(403).send({ status: 403, message: 'Unauthorized.', error: null });

        const dbId = data.id;
        vc_data = await creadSchema.findOne({ _id: dbId });
        res.json(vc_data.vc);

        logger.info('==========CredController ::acceptCredentials Ends ================');
      });
    }
  } catch (error) {
    logger.error('==========CredController ::acceptCredentials Ends ================');

    res.status(500).json(error);
  }
};
const updateCredentials = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('credController :: updateCredential() method start...');
    const { vcId, status } = req.body.QR_DATA;
    let credData: any = await creadSchema.findOne({ 'vc.id': vcId });
    if (!credData) {
      return next(ApiResponse.badRequest(null, 'Invalid credential detail'));
    } else if (credData.status === 'Revoked') {
      return next(ApiResponse.badRequest(null, 'You can not edit credential if it is revoked'));
    } else {
      credData = await creadSchema.findOneAndUpdate(
        { 'vc.id': vcId },
        { status: 'Pending' },
        { returnDocument: 'after' }
      );
    }
    const QR_DATA = {
      QRType: 'ISSUE_CREDENTIAL',
      serviceEndpoint: '',
      schemaId: '',
      appDid: '',
      appName: 'Hypersign Studio',
      challenge: '',
      provider: '',
      data: {
        schemaId: credData.schemaId,
        issuerDid: credData.issuerDid,
        subjectDid: credData.subjectDid,
        orgDid: credData.orgDid,
        expirationDate: credData.expiryDate,
        status,
        vcId,
        credentialStatusUrl: credData.vc_id,
        _id: credData._id,
      },
    };
    QR_DATA.serviceEndpoint = `${WALLET_WEB_HOOK_CREAD}/${credData._id}`;

    logger.info('CredController :: updateCredential() method end...');
    return next(ApiResponse.success({ QR_DATA }));
  } catch (e) {
    logger.error('CredController :: updateCredential() method: Error ' + e);
    return next(ApiResponse.internal(null, e));
  }
};
export {
  issueCredential,
  getCredentialList,
  setCredentialStatus,
  sendCredentialDetail,
  acceptCredentials,
  getCredentialById,
  updateCredentials,
};
