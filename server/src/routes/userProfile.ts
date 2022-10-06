import Router from 'express';
import { fetchUserDetail } from '../controllers/userProfile';

export const profileRoute = (hypersign) => {
  const router = Router();
  router.get('/profile', hypersign.authorize.bind(hypersign), fetchUserDetail);
  return router;
};
