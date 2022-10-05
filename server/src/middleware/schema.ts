import { body, query, param } from 'express-validator';

export const SchemaBody = [
    body('QR_DATA.data.orgDid').trim().exists({ checkFalsy: true}).withMessage("Organisation did can't be null or empty")
]

export const CheckIfQueryParamsIsNumber = [
    query('limit').exists({ checkFalsy: true }).custom((value) => !isNaN(parseInt(value)) && parseInt(value) > 0).withMessage("Limit should be a number greater than 0"),
    query('page').exists({ checkFalsy: true }).custom((value) => !isNaN(parseInt(value)) && parseInt(value) > 0).withMessage("page should be a number greater than 0")

]

export const checkIfSchemaParamExists = [
    param('orgDid').trim().exists({checkFalsy: true }).withMessage("orgDid can not be null or empty")
]