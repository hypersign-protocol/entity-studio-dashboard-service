import { body, param, query } from 'express-validator';
import { logger, rpcEndPoint } from '../config';
import ApiResponse from '../response/apiResponse';
import fetch from 'node-fetch';
let schemaId;
export const checkIfCredentialPramExists = [
  param('orgDid').trim().exists({ checkFalsy: true }).withMessage(' orgDid can not be null or empty'),
];

export const credentialSchemaBody = [
  body('QR_DATA').exists({ checkFalsy: true }).withMessage('QR_DATA should present in body'),
  body('QR_DATA.data.issuerDid').trim().exists({ checkFalsy: true }).withMessage('issuerDid can not be null or empty.'),
  body('QR_DATA.data.subjectDid')
    .trim()
    .exists({ checkFalsy: true })
    .withMessage('subjectDid can not be null or empty.'),
  body('QR_DATA.data.schemaId')
    .trim()
    .exists({ checkFalsy: true })
    .custom((value) => {
      schemaId = value;
      return true;
    })
    .withMessage('schemaId can not be null or empty.'),
  body('QR_DATA.data.orgDid').trim().exists({ checkFalsy: true }).withMessage('orgDid can not be null or empty.'),
];

export const checkIfIdExists = [
  body('id').trim().exists({ checkFalsy: true }).withMessage('id can not be null or empty'),
];
export const checkIfQueryExists = [
  query('token').trim().exists({ checkFalsy: true }).withMessage('token should not be null or empty'),
];

export async function isValidField(req, res, next) {
  try {
    logger.info('isValidField');
    const { fields } = req.body.QR_DATA.data;
    const schemaRpc = rpcEndPoint + schemaId + ':';
    const schemaDetail = await fetch(schemaRpc);
    const resp = await schemaDetail.json();
    const configuredSchemaProperties = JSON.parse(resp.schema[0].schema.properties);
    const tempFields = {};
    fields.forEach((element) => {
      tempFields[element.name] = element.value;

      try {
        if (configuredSchemaProperties[element.name].type) {
          switch (element.type) {
            case 'string': {
              if (!(typeof element.value === 'string' || element.value instanceof String)) {
                return next(ApiResponse.badRequest(null, `Invalid type for field ${element.name}`));
              }
              break;
            }
            case 'integer': {
              if (!Number.isInteger(parseFloat(element.value))) {
                return next(ApiResponse.badRequest(null, `Invalid type for field ${element.name}`));
              }
              break;
            }
            case 'number': {
              if (isNaN(parseInt(element.value))) {
                return next(ApiResponse.badRequest(null, `Invalid type for field ${element.name}`));
              }
              break;
            }
            case 'boolean': {
              if (
                !(
                  (typeof element.value === 'string' &&
                    (element.value.toLowerCase() === 'true' || element.value.toLowerCase() === 'yes')) ||
                  element.value.toLowerCase() === 'false' ||
                  element.value.toLowerCase() === 'no' ||
                  parseInt(element.value) === 1 ||
                  parseInt(element.value) === 0
                )
              ) {
                return next(ApiResponse.badRequest(null, `Invalid type for field ${element.name}`));
              }
              break;
            }
            case 'date': {
              if (isNaN(Date.parse(element.value))) {
                return next(ApiResponse.badRequest(null, `Invalid type for field ${element.name}`));
              }
              break;
            }
          }
        } else {
          logger.info('valid schema field');
        }
      } catch (e) {
        return next(ApiResponse.badRequest(null, 'Invalid schema field'));
      }
    });
    req.body.QR_DATA.data.fields = tempFields;
    next();
  } catch (e) {
    logger.error(e);
    return ApiResponse.internal(null, e);
  }
}
