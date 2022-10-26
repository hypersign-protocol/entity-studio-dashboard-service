import { Request, Response, NextFunction } from 'express';
import { logger } from '../config';
import ApiResponse from '../response/apiResponse';
import OrgModel from '../models/OrgSchema';
import SchemaModel from '../models/Schema';
import PresentationModel from '../models/presentationTemplateSchema';
import CredentialModel from '../models/CreadSchema';

const fetchUserDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('profileCtrl:: fetchUserDetail() method start..');
    const { data } = req.body.hypersign;
    const orgsCount = await OrgModel.countDocuments({ userDid: data.id });
    let schemasCount = await SchemaModel.countDocuments({ primaryDid: data.id });
    // for backward compatibility
    if (schemasCount === 0) {
      schemasCount = await SchemaModel.countDocuments({ did: data.id });
    }
    let templatesCount = await PresentationModel.countDocuments({ primaryDid: data.id });
    // for backward compatibility
    if (templatesCount === 0) {
      templatesCount = await PresentationModel.countDocuments({ templateOwnerDid: data.id });
    }
    const credentialsCount = await CredentialModel.countDocuments({ issuerDid: data.id });
    logger.info('profileCtrl:: fetchUserDetail() method ends...');
    return next(ApiResponse.success({ orgsCount, schemasCount, templatesCount, credentialsCount }));
  } catch (e) {
    logger.error('profileCtrl:: fetchUserDetail(): Error', e);
    return next(ApiResponse.internal(null, e));
  }
};
export { fetchUserDetail };
