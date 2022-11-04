import { Request, Response, NextFunction } from 'express';
import PresentationTemplateSchema, { IPresentationTemplate } from '../models/presentationTemplateSchema';

import HIDWallet from 'hid-hd-wallet';
import HypersignSsiSDK from 'hs-ssi-sdk';
import { walletOptions, mnemonic, logger } from '../config';
import OrgModel from '../models/OrgSchema';
import ApiResponse from '../response/apiResponse';

const verifyPresentation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const hidWalletInstance = new HIDWallet(walletOptions);
    let hsSdk;

    const { vc, issuerDid, holderDid } = req.body;
    hidWalletInstance
      .generateWallet({ mnemonic })
      .then(async () => {
        hsSdk = new HypersignSsiSDK(
          hidWalletInstance.offlineSigner,
          walletOptions.hidNodeRPCUrl,
          walletOptions.hidNodeRestUrl,
          'devnet'
        );
        return hsSdk.init();
      })
      .then(async () => {
        return hsSdk.vp.verifyPresentation({
          signedPresentation: vc,
          challenge: vc.proof.challenge,
          domain: 'https://localhos:20202',
          issuerDid,
          holderDid,
        });
      })
      .then(async (resut) => {
        res.json(resut);
      });
  } catch (error) {
    res.status(500).json(error);
  }
};
const presentationTempalateById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data } = req.body.hypersign;
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
    const id = req.params.id;
    const allTemplate = await PresentationTemplateSchema.findOne({ primaryDid: data.id, _id: id });
    res.json(allTemplate);
  } catch (error) {
    res.status(500).json(error);
  }
};

const presentationTempalateAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('presentationCtrl:: presentationTempalateAll() method start...');
    const { data } = req.body.hypersign;
    const orgDid = req.params.orgDid;
    const allTemplate: Array<IPresentationTemplate> = await PresentationTemplateSchema.find({
      primaryDid: data.id,
      orgDid,
    });
    logger.info('presentationCtrl:: presentationTempalateAll() method ends...');
    return next(ApiResponse.success(allTemplate));
  } catch (error) {
    logger.error('presentationCtrl:: presentationTempalateAll() : Error ', error);
    return next(ApiResponse.internal(null, error));
  }
};
const presentationTempalate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('presentationControllers:: presentationTempalate() method start...');
    const { queryType, domain, name, issuerDid, schemaId, reason, required, callbackUrl, orgDid } = req.body;
    const { data } = req.body.hypersign;
    logger.info('presentationControllers:: presentationTempalate() saving template data to DB');

    const presentationTemplateObj: IPresentationTemplate = await PresentationTemplateSchema.create({
      queryType,
      orgDid,
      domain,
      name,
      issuerDid,
      schemaId,
      reason,
      required,
      callbackUrl,
      templateOwnerDid: issuerDid,
      primaryDid: data.id,
    });
    const orgDetail: any = await OrgModel.findById({ _id: presentationTemplateObj.orgDid });
    let templatesCount;
    if (!orgDetail.templatesCount) {
      templatesCount = await PresentationTemplateSchema.countDocuments({ orgDid: presentationTemplateObj.orgDid });
    } else {
      templatesCount = orgDetail.templatesCount + 1;
    }
    await OrgModel.findByIdAndUpdate({ _id: presentationTemplateObj.orgDid }, { templatesCount });

    logger.info('presentationControllers:: presentationTempalate() method ends...');
    return next(ApiResponse.success({ presentationTemplateObj }));
  } catch (error) {
    logger.error('presentationControllers:: presentationTemplate: Error ' + error);
    return next(ApiResponse.internal(null, error));
  }
};
const updatePresentation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('presentationControllers:: updatePresentation() method start ...');
    const { _id, issuerDid, name, schemaId, reason, required, callbackUrl, hypersign, orgDid } = req.body;
    const filter = { issuerDid, name, schemaId, reason, required, callbackUrl };
    let templateData;
    try {
      templateData = await PresentationTemplateSchema.where({ _id, orgDid }).findOne();
    } catch (e) {
      return next(ApiResponse.badRequest(null, `${_id} is a invalid templateId`));
    }
    if (!templateData) {
      return next(ApiResponse.badRequest(null, `No template exists with Id ${_id}`));
    }
    if (templateData.primaryDid !== hypersign.data.id) {
      return next(ApiResponse.badRequest(null, 'You can not edit this template'));
    }
    templateData = await PresentationTemplateSchema.findByIdAndUpdate({ _id }, filter, { returnDocument: 'after' });
    return next(ApiResponse.success(templateData));
  } catch (e) {
    logger.error('presentationControllers:: updatePresentation() method Error: ' + e);
    return next(ApiResponse.internal(null, e));
  }
};
const deletePresentationTemplate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('presentationControllers:: deletePresentationTemplate() method start ....');
    const id = req.params.id;
    const { hypersign } = req.body;
    let templateDetail;
    try {
      templateDetail = await PresentationTemplateSchema.findById({ _id: id });
    } catch (e) {
      return next(ApiResponse.badRequest(null, `${id} is a invalid templateId`));
    }
    if (!templateDetail) {
      return next(ApiResponse.badRequest(null, `No template exists with ${id}. `));
    }
    if (templateDetail.primaryDid !== hypersign.data.id) {
      return next(ApiResponse.badRequest(null, `You can not delete this template`));
    }
    templateDetail = await PresentationTemplateSchema.findOneAndDelete({ _id: id });
    const orgDetail: any = await OrgModel.findById({ _id: templateDetail.orgDid });
    if (orgDetail.templatesCount) {
      await OrgModel.findByIdAndUpdate({ _id: templateDetail.orgDid }, { $inc: { templatesCount: -1 } });
    }
    return next(ApiResponse.success(templateDetail));
  } catch (e) {
    logger.error('presentationControllers:: deletePresentationTemplate() method Error: ' + e);
    return next(ApiResponse.internal(null, e));
  }
};

export {
  verifyPresentation,
  presentationTempalate,
  presentationTempalateAll,
  presentationTempalateById,
  deletePresentationTemplate,
  updatePresentation,
};
