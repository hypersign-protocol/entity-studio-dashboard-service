import { Router } from 'express';
import { appSchemaBody, checkIfClientCredentialExists } from './middleware/appMiddleware';
import { validateRequestSchema } from './middleware/validateRequestSchema';
import { registerApp, generateAccessToken } from './appController';
export const AppRoutes = (hypersign) => {
  const router = Router();
  router.post('/register', hypersign.authorize.bind(hypersign), appSchemaBody, validateRequestSchema, registerApp);
  return router;
};

export const AppAuthRoutes = () => {
  const router = Router();
  router.post('/', checkIfClientCredentialExists, validateRequestSchema, generateAccessToken);
  return router;
};
