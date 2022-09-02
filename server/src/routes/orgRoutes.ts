import Router from 'express';
import { CreateOrg, deleteOrg, GetOrgById, GetOrgByIdSSE, GetOrgsByUserDid, setOrgStatus, updateOrg } from '../controllers/orgControllers';


export const orgRoutes = (hypersign) => {
    const router = Router();
    router.post('/create', hypersign.authorize.bind(hypersign),CreateOrg);

    router.post('/status/:id',setOrgStatus )
    router.put('/update', hypersign.authorize.bind(hypersign),updateOrg)
    router.get('/all', hypersign.authorize.bind(hypersign), GetOrgsByUserDid)
    router.get('/sse/:id',GetOrgByIdSSE)
    router.get('/get/:id', hypersign.authorize.bind(hypersign),GetOrgById)
    router.delete('/delete/:id', hypersign.authorize.bind(hypersign),deleteOrg )
    return router
}