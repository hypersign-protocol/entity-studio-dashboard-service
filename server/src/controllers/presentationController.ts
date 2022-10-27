import { Request, Response, NextFunction } from 'express';
import PresentationTemplateSchema, { IPresentationTemplate } from '../models/presentationTemplateSchema';

import HIDWallet from 'hid-hd-wallet';
import HypersignSsiSDK from 'hs-ssi-sdk';
import { walletOptions, mnemonic, logger } from '../config';
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
    logger.info('presentationControllers:: presentationTempalate() method ends...');
    return next(ApiResponse.success({ presentationTemplateObj }));
  } catch (error) {
    logger.error('presentationControllers:: presentationTemplate: Error ' + error);
    return next(ApiResponse.internal(null, error));
  }
};
const deletePresentationTemplate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('presentationControllers:: deletePresentationTemplate() method start ....');
    const id = req.params.id;
    const templateDetail = await PresentationTemplateSchema.findOneAndDelete({ _id: id });
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
};
