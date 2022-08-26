import Router from 'express';
import { getSchema, saveSchema, setStatusSchema } from '../controllers/schemaController';

export const schemaRoutes = (hypersign) => {
    const router = Router()

    router.post('/issue', hypersign.authorize.bind(hypersign),saveSchema)
    router.post('/status/:id', setStatusSchema)
    router.get('/get', hypersign.authorize.bind(hypersign),getSchema)
    
    return router;
}