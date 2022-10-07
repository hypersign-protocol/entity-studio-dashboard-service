import Router from 'express';
import User from '../models/UserSchema';
import Org from '../models/OrgSchema';
import { logger } from '../config';
export const walletAuthRoutes = (hypersign) => {
  const router = Router();
  // Implement authentication API
  // Doc: https://github.com/hypersign-protocol/hypersign-auth-js-sdk/blob/master/docs.md#hypersignauthenticate
  router.post('/hs/api/v2/auth', hypersign.authenticate.bind(hypersign), async (req, res) => {
    try {
      const { user } = req.body.hypersign.data;
      const { name, email, id } = user;
      logger.info(name, email, id);

      const query = { email, did: id };
      const options = { upsert: true, new: true, setDefaultsOnInsert: true };
      const userObj = await User.find({ email, did: id });
      if (userObj.length === 0) {
        const newUser = new User({ email, did: id, name });
        await newUser.save();
      }

      // Do something with the user data.
      // The hsUserData contains userdata and authorizationToken
      res.status(200).send({ status: 200, message: user, error: null });
    } catch (e) {
      res.status(500).send({ status: 500, message: 'failure', error: e });
    }
  });

  // Implement /register API:
  // Analogous to register user but not yet activated
  // Doc: https://github.com/hypersign-protocol/hypersign-auth-js-sdk/blob/master/docs.md#hypersignregister
  router.post('/hs/api/v2/register', hypersign.register.bind(hypersign), (req, res) => {
    try {
      logger.info('Register success');
      // You can store userdata (req.body) but this user is not yet activated since he has not
      // validated his email.
      res.status(200).send({ status: 200, message: req.body.hypersign.data, error: null });
    } catch (e) {
      res.status(500).send({ status: 500, message: null, error: e });
    }
  });

  // Implement /credential API:
  // Analogous to activate user
  // Doc: https://github.com/hypersign-protocol/hypersign-auth-js-sdk/blob/master/docs.md#hypersignissuecredential
  router.get('/hs/api/v2/credential', hypersign.issueCredential.bind(hypersign), (req, res) => {
    try {
      logger.info('Credential success');
      const { hypersign } = req.body;
      const { data } = hypersign;
      res.status(200).send({ ...data });
    } catch (e) {
      res.status(500).send({ status: 500, message: null, error: e });
    }
  });

  // Any resource which you want to protect
  // Must pass Authorization: Bearer <accessToken>  as header
  // Doc: https://github.com/hypersign-protocol/hypersign-auth-js-sdk/blob/master/docs.md#hypersignauthorize
  router.post('/api/v2/protected', hypersign.authorize.bind(hypersign), (req, res) => {
    try {
      const user = req.body.hypersign.data;
      // Do whatever you want to do with it
      res.status(200).send({ status: 200, message: user, error: null });
    } catch (e) {
      res.status(500).send(e);
    }
  });

  // New session
  // Doc: https://github.com/hypersign-protocol/hypersign-auth-js-sdk/blob/master/docs.md#hypersignchallenge
  router.post('/challenge', hypersign.challenge.bind(hypersign), (req, res) => {
    res.status(200).send(req.body);
  });

  // Polling if authentication finished
  // Doc: https://github.com/hypersign-protocol/hypersign-auth-js-sdk/blob/master/docs.md#hypersignpoll
  router.get('/poll', hypersign.poll.bind(hypersign), (req, res) => {
    res.status(200).send(req.body);
  });

  return router;
};
