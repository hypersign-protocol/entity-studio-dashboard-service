import { Router } from 'express'
import { presentationTempalate, presentationTempalateAll, presentationTempalateById } from '../controllers/presentationController';
import { getChallenge , verify} from '../controllers/presentationRequestController';

export const presentationRoute = (hypersign) => {
    const router = Router()

    // PresentationRequest
    router.get('/request/:presentationTemplateId', getChallenge)
    router.post('/request/verify', verify)
    
    // PresentationTemplate
    router.post('/template', hypersign.authorize.bind(hypersign), presentationTempalate)
    router.get('/template/:id', hypersign.authorize.bind(hypersign), presentationTempalateById)
    router.get('/template/org/:orgDid', hypersign.authorize.bind(hypersign), presentationTempalateAll)
    return router;
}



