import Router from 'express';
import { getSchema, getSchemaById, saveSchema, setStatusSchema } from '../controllers/schemaController';
import { SchemaBody, CheckIfQueryParamsIsNumber, checkIfSchemaParamExists } from '../middleware/schema';
import { validateRequestSchema } from '../middleware/validateRequestSchema';
export const schemaRoutes = (hypersign) => {
  const router = Router();

  router.post('/', hypersign.authorize.bind(hypersign), SchemaBody, validateRequestSchema, saveSchema);
  router.post('/status/:id', setStatusSchema);
  router.get('/sse/:id', /* hypersign.authorize.bind(hypersign)*/ getSchemaById);
  router.get(
    '/:orgDid',
    hypersign.authorize.bind(hypersign),
    CheckIfQueryParamsIsNumber,
    checkIfSchemaParamExists,
    validateRequestSchema,
    getSchema
  );

  return router;
};
