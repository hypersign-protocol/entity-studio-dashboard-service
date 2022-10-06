import { body, param } from 'express-validator';
import { isValidURL } from '../utils/fields';

export const presentationSchemaBody = [
  body('queryType').trim().exists({ checkFalsy: true }).withMessage('queryType can not be null or empty'),
  body('domain').trim().exists({ checkFalsy: true }).withMessage('domain can not be null or empty'),
  body('schemaId').trim().exists({ checkFalsy: true }).withMessage('schemaId cannot be null or empty'),
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
