import PresentationRequestSchema, { IPresentationRequest } from '../models/PresentationRequest';
import PresentationTemplateSchema, { IPresentationTemplate } from '../models/presentationTemplateSchema';
import OrgSchema, { IOrg } from '../models/OrgSchema';
import { logger, studioServerBaseUrl, jwtSecret } from '../config';
import { urlSanitizer } from '../utils/fields';
import userCredInfoModel, { IUserPresentation } from '../models/userCredentialInfo';
import JWT from 'jsonwebtoken';
import { uuid } from 'uuidv4';
import ApiResponse from '../response/apiResponse';

import HIDWallet from 'hid-hd-wallet';
import { HypersignSSISdk } from 'hs-ssi-sdk';
import { walletOptions, mnemonic } from '../config';

const verifyPresentation = async (vp, challenge, issuerDid, holderDid, domain, holderDidDocSigned) => {
  logger.info('pContrl:: verifyPresentation() method starts');
  logger.info({
    vp,
    challenge,
    issuerDid,
    holderDid,
    domain,
  });

  // TODO: This initialization need to be done one time globally
  const hidWalletInstance = new HIDWallet(walletOptions);
  await hidWalletInstance.generateWallet({ mnemonic });
  const hsSdk = new HypersignSSISdk({
    offlineSigner: hidWalletInstance.offlineSigner,
    nodeRpcEndpoint: walletOptions.hidNodeRPCUrl,
    nodeRestEndpoint: walletOptions.hidNodeRestUrl,
    namespace: 'testnet',
  });
  await hsSdk.init();
  const holderVerificationMethodId = vp.proof.verificationMethod;
  const issuerVerificationMethodId = vp.verifiableCredential[0].proof.verificationMethod;

  const result = await hsSdk.vp.verify({
    signedPresentation: vp,
    challenge,
    domain: vp.proof.domain,
    issuerDid,
    //holderDid,
    holderDidDocSigned: JSON.parse(holderDidDocSigned),
    holderVerificationMethodId,
    issuerVerificationMethodId,
  });
  logger.debug(`Result of verifyPresentation() is ${result}`);
  return result;
};

function writeServerSendEvent(res, sseId, data) {
  res.write('id: ' + sseId + '\n');
  res.write('data: ' + data + '\n\n');
}

export async function verify(req, res, next) {
  try {
    logger.info('pCntrl:: verify() method start....');
    const { challenge, vp } = req.body;
    let { holderDidDocSigned } = req.body;
    const publicKeyMultiBaseTemp = JSON.parse(holderDidDocSigned).id.split(':'); //[-1];
    const publicKeyMultiBase = publicKeyMultiBaseTemp[publicKeyMultiBaseTemp.length - 1];
    const parsedDidDoc = JSON.parse(holderDidDocSigned);
    parsedDidDoc.verificationMethod[0].publicKeyMultibase = publicKeyMultiBase;
    holderDidDocSigned = JSON.stringify(parsedDidDoc);
    if (!challenge || !vp) {
      return res.status(400).send({ status: 400, message: null, error: 'challenge and vp must be passed' });
    }

    // TODO: 1. fetch challeng record from db, if not throw error
    const presentationRequest: IPresentationRequest = (await PresentationRequestSchema.findOne({
      challenge: challenge,
      status: 0,
    })) as IPresentationRequest;
    if (!presentationRequest) {
      return res
        .status(401)
        .send({ status: 401, message: null, error: 'Invalid challenge. Refresh the page and try again.' });
    }

    const { expiresTime, templateId } = presentationRequest;
    const presentationTemplate: IPresentationTemplate = (await PresentationTemplateSchema.findOne({
      _id: templateId,
    })) as IPresentationTemplate;
    if (!presentationTemplate) {
      return res.status(400).send({ status: 400, message: null, error: 'Invalid templateId' });
    }

    // TODO: 2. check the exprity time of the challege , if not throw error
    const now: number = new Date().getTime();
    if (now > expiresTime) {
      return res
        .status(401)
        .send({ status: 401, message: null, error: 'The session expired. Refresh the page and try again.' });
    }

    // TODO: 3. verify the presentation, if not throw error
    const parsedVP = JSON.parse(vp);
    const vc = parsedVP.verifiableCredential[0]; // TODO: You should not hard code to fetch just one vc;  you should get holderDid from request body
    const templateIssuers: Array<string> = presentationTemplate.issuerDid;
    const result = await verifyPresentation(
      parsedVP,
      challenge,
      templateIssuers[0], //  TODO: Need to fix this hardcoing
      vc.credentialSubject.id,
      presentationTemplate.domain,
      holderDidDocSigned
    );

    const verified = result['verified'];
    logger.debug(`Result of credential verification ${result['verified']}`);
    if (verified === true) {
      // TODO: 4. send data or create JWT

      // TODO: 5. Update the status to success i.e 1 in background
      const presentationInfo = JSON.parse(vp);
      logger.info('pCntrl:: verify() method storing cred data to db');
      const userCredInfo = await userCredInfoModel.create({
        holderDid: presentationInfo.holder,
        credentialId: presentationInfo.verifiableCredential[0].id,
        credentialDetail: presentationInfo.verifiableCredential[0].credentialSubject,
        presentation: presentationInfo,
      });
      const accessToken = JWT.sign({ id: userCredInfo._id }, jwtSecret, { expiresIn: '5m' });
      PresentationRequestSchema.findOneAndUpdate({ challenge: challenge }, { status: 1, accessToken }).exec();
      logger.info('pCntrl:: verify() method ends....');

      return res.status(200).send({ status: 200, message: 'OK', error: null });
    } else {
      // TODO: 4. send data or create JWT
      logger.info('pCntrl:: verify() method ends....');
      return res.status(401).send({ status: 401, message: null, error: 'Unauthorized' });
    }
  } catch (e) {
    res.status(500).json(e);
  }
}

export async function getChallenge(req, res, next) {
  try {
    logger.info('PresentationCont:: getChallenge() method starts......');
    const { presentationTemplateId } = req.params;
    if (!presentationTemplateId) {
      return res.status(400).send('presentationTemplateId can not be null or empty');
    }

    // Fetch the presentation template presentationTemplateId
    const presentationTemplate: IPresentationTemplate = (await PresentationTemplateSchema.findOne({
      _id: presentationTemplateId,
    })) as IPresentationTemplate;
    if (!presentationTemplate) {
      return res.status(400).send('invalid presentationTemplateId = ' + presentationTemplateId);
    }

    const { schemaId, templateOwnerDid, orgDid, domain, reason } = presentationTemplate;

    const org: IOrg = (await OrgSchema.findOne({ _id: orgDid })) as IOrg;

    const { name } = org;

    const challenge = uuid();
    const now = new Date();
    const expiresTime = now.setMinutes(now.getMinutes() + 1); // 5 mintues from now will expires.
    const pRequest = await new PresentationRequestSchema({
      templateId: presentationTemplateId,
      challenge,
      expiresTime,
      status: 0,
    }).save();
    // For the QR Data
    // Insert a new challenge in db
    const QR_DATA = {
      op: 'init',
      data: {
        QRType: 'REQUEST_CRED',
        serviceEndpoint: `${urlSanitizer(studioServerBaseUrl, false)}/api/v1/presentation/request/verify/`,
        schemaId: schemaId,
        appDid: templateOwnerDid,
        appName: name,
        challenge,
        reason,
        domain,
      },
    };

    logger.info('==========SchemaController ::getSchemaById Ends================');
    res.setHeader('Access-Control-Allow-Origin', domain);
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-Accel-Buffering', 'no');

    const sseId = challenge;
    const setinterval = setInterval(function () {
      PresentationRequestSchema.findOne({ challenge: challenge })
        .then((result) => {
          if (result) {
            const QR_DATA = {
              op: '',
              message: {},
            };
            if (result.status === 1) {
              QR_DATA.op = 'end';
              QR_DATA['message'] = {
                status: 'Verified',
                accessToken: result.accessToken,
              };
              QR_DATA['accessToken'] = result.accessToken;
              // TODO: 4. end the interval and end the response
              clearInterval(setinterval);

              return writeServerSendEvent(res, sseId, JSON.stringify(QR_DATA));

              // The interval will be closed one its verified
            } else {
              QR_DATA.op = 'processing';
              QR_DATA['message'] = 'Waiting for verificaiton...';
              // TODO: 4.  wait till the challege is verified
              return writeServerSendEvent(res, sseId, JSON.stringify(QR_DATA));
            }
          }
        })
        .catch((err) => {
          logger.error('SchemaController ::getChallenge : Error', err);
        });
    }, 5000); // TODO: Take this in env,  sending every 10 sec

    // The interval should also close once the challenge is expired
    setTimeout(() => {
      const QR_DATA = {
        op: '',
        message: '',
      };
      QR_DATA.op = 'end';
      QR_DATA['message'] = 'Challenge expired';
      writeServerSendEvent(res, sseId, JSON.stringify(QR_DATA));
      clearInterval(setinterval);
      return res.end();
    }, expiresTime - Date.now());

    writeServerSendEvent(res, sseId, JSON.stringify(QR_DATA));
  } catch (error) {
    logger.error('==========SchemaController ::getSchemaById Ends================');
    logger.error('SchemaController ::getSchemaById : Error', error);
    res.status(500).json(error);
  }
}

export async function getUserCredDetail(req, res, next) {
  try {
    logger.info('pCtrl:: getUserCredDetail() method starts....');
    const { accesstoken } = req.headers;
    let id;

    if (!accesstoken) {
      return next(ApiResponse.badRequest(null, 'Please send accessToken in header'));
    }
    await JWT.verify(accesstoken, jwtSecret, async (err, decode) => {
      if (err) {
        if (err.name === 'JsonWebTokenError') {
          return next(ApiResponse.badRequest(null, 'Token is invalid'));
        } else {
          if (err.name === 'TokenExpiredError') {
            return next(ApiResponse.badRequest(null, 'Token has expired'));
          }
        }
      }
      id = decode.id;
    });
    const userDetail = await userCredInfoModel.findOne({ _id: id });
    if (!userDetail) {
      return next(ApiResponse.badRequest(null, `User detail for ${id} does not exists`));
    }
    const userInfo = userDetail.presentation;
    await userCredInfoModel.findByIdAndDelete({ _id: id });
    return next(ApiResponse.success(userInfo));
  } catch (e) {
    logger.error('pCtrl:: getUserCredDetail() method Error: ' + e);
    return next(ApiResponse.internal(null, e));
  }
}
