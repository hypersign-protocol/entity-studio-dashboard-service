import Router from 'express';
import { CreateOrg, deleteOrg, GetOrgById, GetOrgsByUserDid, updateOrg } from '../controllers/orgControllers';


export const orgRoutes = (hypersign) => {
    const router = Router();
    router.post('/create', hypersign.authorize.bind(hypersign),CreateOrg);
    router.put('/update', hypersign.authorize.bind(hypersign),updateOrg)
    router.get('/all', hypersign.authorize.bind(hypersign), GetOrgsByUserDid)
    router.get('/get/:id', hypersign.authorize.bind(hypersign),GetOrgById)
    router.delete('/delete/:id', hypersign.authorize.bind(hypersign),deleteOrg )
    return router
}