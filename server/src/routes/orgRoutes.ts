import Router from 'express';
import { CreateOrg, deleteOrg, GetOrgByDid, GetOrgById, GetOrgByIdSSE, GetOrgsByUserDid, setOrgStatus, updateOrg } from '../controllers/orgControllers';
import { OrgSchemaBody, checkIfOrgIdExists } from '../middleware/org';
import { validateRequestSchema } from '../middleware/validateRequestSchema'
export const orgRoutes = (hypersign) => {
    const router = Router();
    router.post('/', hypersign.authorize.bind(hypersign), OrgSchemaBody, validateRequestSchema, CreateOrg);

    router.post('/status/:id', setOrgStatus)
    router.put('/', hypersign.authorize.bind(hypersign), checkIfOrgIdExists, OrgSchemaBody, validateRequestSchema, updateOrg)
    router.get('/', hypersign.authorize.bind(hypersign), GetOrgsByUserDid)
    router.get('/sse/:id',GetOrgByIdSSE)
    router.get('/get/:id', hypersign.authorize.bind(hypersign),GetOrgById)
    router.get('/:orgDid', hypersign.authorize.bind(hypersign),GetOrgByDid)
    router.delete('/delete/:id', hypersign.authorize.bind(hypersign),deleteOrg )
    return router
}