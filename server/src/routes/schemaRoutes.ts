import Router from 'express';
import { getSchema, getSchemaById, saveSchema, setStatusSchema } from '../controllers/schemaController';

export const schemaRoutes = (hypersign) => {
    const router = Router()

    router.post('/issue', hypersign.authorize.bind(hypersign),saveSchema)
    router.post('/status/:id', setStatusSchema)
    router.get('/sse/:id',/* hypersign.authorize.bind(hypersign)*/ getSchemaById)
    router.get('/get/:orgDid', hypersign.authorize.bind(hypersign),getSchema)
    
    return router;
}