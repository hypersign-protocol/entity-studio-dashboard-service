import { body, param, header } from 'express-validator';
import { isValidURL } from '../utils/fields';
import { logger } from '../config';
import presentationModel, { IPresentationTemplate } from '../models/presentationTemplateSchema';
import { URL } from 'url';
export const presentationSchemaBody = [
  body('queryType').trim().exists({ checkFalsy: true }).withMessage('queryType can not be null or empty'),
  body('domain').trim().exists({ checkFalsy: true }).withMessage('domain can not be null or empty'),
  body('schemaId').isArray().withMessage('issuerDid must be an array'),
  body('issuerDid').isArray().withMessage('issuerDid must be an array'),
  body('issuerDid').trim().exists({ checkFalsy: true }).withMessage(' issuerDid can not be null or empty'),
  body('callbackUrl')
    .trim()
    .exists({ checkFalsy: true })
    .custom((value) => isValidURL(value))
    .withMessage(' callbackUrl is invalid or empty'),
  body('reason').trim().exists({ checkFalsy: true }).withMessage(' reason can not be null or empty'),
];
export const presentationSchemaParams = [
  param('orgDid').trim().exists({ checkFalsy: true }).withMessage('orgDid can not be null or empty'),
];
export const isIdExists = [param('id').trim().exists({ checkFalsy: true }).withMessage('Id cannot be null or empty')];
export const isIdExistsInBody = [
  body('_id').trim().exists({ checkFalsy: true }).withMessage('id can not be null or empty'),
];
export const isAccessTokenExists = [
  header('accesstoken')
    .trim()
    .exists({ checkFalsy: true })
    .custom((value) => {
      return true;
    })
    .withMessage('Please send accessToken'),
];
export async function verifyOrigin(req, callback) {
  logger.info('Presentation middleware verifyOrigin() method starts');
  let corsOptions;
  let message;
  const { presentationTemplateId } = req.params;
  console.log(presentationTemplateId);
  const presentationTemplate: IPresentationTemplate = (await presentationModel.findOne({
    _id: presentationTemplateId,
  })) as IPresentationTemplate;
  const { domain } = presentationTemplate;
  const parsedBaseUrl = new URL(domain);
  if (parsedBaseUrl.origin === req.header('Origin')) {
    message = null;
    corsOptions = { origin: true };
  } else {
    message = 'OriginMismatch';
    corsOptions = { origin: false };
  }
  callback(message, corsOptions);
}
