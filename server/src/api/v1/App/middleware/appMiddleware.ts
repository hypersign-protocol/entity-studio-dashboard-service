import { body } from 'express-validator';

export const appSchemaBody = [
  body('appName').trim().exists({ checkFalsy: true }).withMessage("appName can't be null or empty"),
  body('tenantSubdomain').trim().exists({ checkFalsy: true }).withMessage("tenantSubdomain can't be null or empty"),
];

export const checkIfClientCredentialExists = [
  body('clientId').trim().exists({ checkFalsy: true }).withMessage("clientId can't be null or empty"),
  body('tenantSubdomain').trim().exists({ checkFalsy: true }).withMessage('tenantSubdomain can not be null or empty'),
  body('clientSecret').trim().exists({ checkFalsy: true }).withMessage("clientSecret can't be null or empty"),
  body('grantType').trim().exists({ checkFalsy: true }).withMessage("grantType can't be null or empty"),
];
