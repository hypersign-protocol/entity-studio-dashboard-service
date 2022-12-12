import { Request, Response, NextFunction } from 'express';
import { logger, jwtSecret } from '../../../config';
import ApiResponse from './response/apiResponse';
import appModel, { IApp } from './model';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { TIME } from './utils';
import { GrantType } from './utils';

async function registerApp(req: Request, res: Response, next: NextFunction) {
  try {
    logger.info('appController:: registerApp() method start... ');
    const { hypersign, appName, tenantSubdomain } = req.body;
    if (!appName || appName == '') {
      return next(ApiResponse.badRequest(null, "appName can't be null or empty"));
    }
    let appDetail = await appModel.findOne({ tenantSubdomain, appName });
    if (appDetail) {
      return next(ApiResponse.badRequest(null, `App ${appName} is already registered`));
    }
    appDetail = await appModel.create({
      appName,
      userId: hypersign.data.id,
      tenantSubdomain,
      clientId: crypto.randomBytes(8).toString('hex'),
      clientSecret: crypto.randomBytes(20).toString('hex'),
      kmsId: crypto.randomBytes(8).toString('hex'),
      edvId: Math.random().toString(36).substring(2, 7),
    });
    return next(ApiResponse.Createdsuccessfully(appDetail));
  } catch (e) {
    logger.error('appController:: registerApp() method: Error ' + e);
    return next(ApiResponse.internal(null, e));
  }
}
async function generateAccessToken(req: Request, res: Response, next: NextFunction) {
  try {
    logger.info('appController:: generateAccessToken() method start... ');
    const { clientId, tenantSubdomain, clientSecret, grantType } = req.body;
    if (!(grantType in GrantType)) {
      return next(ApiResponse.badRequest(null, 'Invalid grantType'));
    }
    const credDetail = await appModel.findOne({ clientId, tenantSubdomain, clientSecret });
    if (!credDetail) {
      return next(ApiResponse.Unauthorized(null, 'Access denied'));
    }
    const token = jwt.sign({ id: credDetail._id, clientId, tokenType: 'Bearer' }, jwtSecret, {
      expiresIn: '4h',
    });
    const expiresIn = (4 * TIME.ONE_HOUR) / 1000;
    return next(ApiResponse.success({ token, expiresIn, tokenType: 'Bearer' }));
  } catch (e) {
    logger.error('appController:: registerApp() method: Error ' + e);
    return next(ApiResponse.internal(null, e));
  }
}

export { registerApp, generateAccessToken };
