import { body, param } from 'express-validator';

export const checkIfCredentialPramExists =[
    param('orgDid').trim().exists({checkFalsy: true }).withMessage(' orgDid can not be null or empty')
]

export const credentialSchemaBody = [
    body('QR_DATA').exists({checkFalsy: true}).withMessage('QR_DATA should present in body'),
    body('QR_DATA.data.issuerDid').trim().exists({ checkFalsy: true}).withMessage('issuerDid can not be null or empty.'),
    body('QR_DATA.data.subjectDid').trim().exists({ checkFalsy: true}).withMessage('subjectDid can not be null or empty.'),
    body('QR_DATA.data.schemaId').trim().exists({ checkFalsy: true}).withMessage('schemaId can not be null or empty.'),
    body('QR_DATA.data.orgDid').trim().exists({ checkFalsy: true}).withMessage("orgDid can not be null or empty.")

]

export const checkIfIdExists= [
    body('id').trim().exists({checkFalsy: true}).withMessage('id can not be null or empty')
]