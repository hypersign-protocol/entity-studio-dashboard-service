import { Router } from 'express'
import { presentationTempalate, verifyPresentation, presentationTempalateAll, presentationTempalateById } from '../controllers/presentationController';

export const presentationRoute = (hypersign) => {
    const router = Router()


    router.post('/verify', verifyPresentation)
    router.post('/template', hypersign.authorize.bind(hypersign), presentationTempalate)
    router.get('/template/:id', hypersign.authorize.bind(hypersign), presentationTempalateById)
    router.get('/template/:orgDid', hypersign.authorize.bind(hypersign), presentationTempalateAll)
    return router;
}



