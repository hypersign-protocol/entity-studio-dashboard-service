import { Router } from 'express';
import * as appCtrl from '../controllers/verifiableCredentialsController';
import {
  checkIfCredentialPramExists,
  credentialSchemaBody,
  checkIfIdExists,
  checkIfQueryExists,
} from '../middleware/verifiableCredential';
import { validateRequestSchema } from '../middleware/validateRequestSchema';

export const credentialRoutes = (hypersign) => {
  const router = Router();
  router.post(
    '/',
    hypersign.authorize.bind(hypersign),
    credentialSchemaBody,
    validateRequestSchema,
    appCtrl.issueCredential
  );
  router.post('/status/:id', appCtrl.setCredentialStatus);
  router.get('/sse/:id', appCtrl.getCredentialById);
  router.get(
    '/org/:orgDid',
    hypersign.authorize.bind(hypersign),
    checkIfCredentialPramExists,
    validateRequestSchema,
    appCtrl.getCredentialList
  );
  router.post('/send', checkIfIdExists, validateRequestSchema, appCtrl.sendCredentialDetail);
  router.get('/walletAccepct', checkIfQueryExists, validateRequestSchema, appCtrl.acceptCredentials);
  return router;
};
