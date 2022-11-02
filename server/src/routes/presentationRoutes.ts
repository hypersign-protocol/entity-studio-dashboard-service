import { Router } from 'express';
import {
  presentationTempalate,
  verifyPresentation,
  presentationTempalateAll,
  presentationTempalateById,
  deletePresentationTemplate,
  updatePresentation,
} from '../controllers/presentationController';
import { getChallenge, verify, getUserCredDetail } from '../controllers/pController';
import {
  presentationSchemaBody,
  presentationSchemaParams,
  verifyOrigin,
  isIdExists,
  isIdExistsInBody,
  isAccessTokenExists,
} from '../middleware/presentation';
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
  router.put(
    '/template',
    hypersign.authorize.bind(hypersign),
    presentationSchemaBody,
    isIdExistsInBody,
    updatePresentation
  );
  router.delete(
    '/template/:id',
    hypersign.authorize.bind(hypersign),
    isIdExists,
    validateRequestSchema,
    deletePresentationTemplate
  );

  return router;
};

export const presentationRequestRoute = () => {
  const router = Router();
  router.get('/info', isAccessTokenExists, getUserCredDetail);
  router.get('/:presentationTemplateId', cors(verifyOrigin), getChallenge);

  return router;
};
