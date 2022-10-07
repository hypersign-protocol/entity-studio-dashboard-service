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
    const schemasCount = await SchemaModel.countDocuments({ did: data.id });
    const templatesCount = await PresentationModel.countDocuments({ templateOwnerDid: data.id });
    const credentialsCount = await CredentialModel.countDocuments({ issuerDid: data.id });
    logger.error('profileCtrl:: fetchUserDetail() method ends...');
    return next(ApiResponse.success({ orgsCount, schemasCount, templatesCount, credentialsCount }));
  } catch (e) {
    logger.error('profileCtrl:: fetchUserDetail(): Error', e);
    return next(ApiResponse.internal(null, e));
  }
};
export { fetchUserDetail };
