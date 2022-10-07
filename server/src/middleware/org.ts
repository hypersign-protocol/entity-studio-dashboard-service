import { body } from 'express-validator';

export const OrgSchemaBody = [
  body('orgData.name').trim().exists({ checkFalsy: true }).withMessage("Organisation name can't be null or empty"),
];
export const checkIfOrgIdExists = [
  body('orgData._id').trim().exists({ checkFalsy: true }).withMessage('Org id can not be null or empty'),
];
