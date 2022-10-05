import { body } from 'express-validator';

export const OrgSchemaBody = [
    body('orgData.name').trim().exists({ checkFalsy: true}).withMessage("Organisation name can't be null or empty")
]