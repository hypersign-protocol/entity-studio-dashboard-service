import { Router } from 'express';
import {
  presentationTempalate,
  verifyPresentation,
  presentationTempalateAll,
  presentationTempalateById,
} from '../controllers/presentationController';
import { getChallenge, verify } from '../controllers/pController';
import { presentationSchemaBody, presentationSchemaParams, verifyOrigin } from '../middleware/presentation';
import { validateRequestSchema } from '../middleware/validateRequestSchema';
import cors from 'cors';

export const presentationRoute = (hypersign) => {
  const router = Router();
  router.post('/request/verify', verify);
  router.post(
    '/template',
    hypersign.authorize.bind(hypersign),
    presentationSchemaBody,
    validateRequestSchema,
    presentationTempalate
  );
  router.get('/template/:id', hypersign.authorize.bind(hypersign), presentationTempalateById);
  router.get(
    '/template/org/:orgDid',
    hypersign.authorize.bind(hypersign),
    presentationSchemaParams,
    validateRequestSchema,
    presentationTempalateAll
  );
  return router;
};

export const presentationRequestRoute = () => {
  const router = Router();
  router.get('/:presentationTemplateId', cors(verifyOrigin), getChallenge);

  return router;
};
