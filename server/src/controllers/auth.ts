import { Request, Response } from 'express';
import { User } from '../services/user.service';
import { logger, jwtSecret, jwtExpiryInMilli } from '../config';
import jwt from 'jsonwebtoken';
import { hypersignSDK } from '../config';
import { store } from '../utils/file';
import path from 'path';
import fs from 'fs';

const check = (req: Request, res: Response) => {
  const param = {
    chJWT: 'chJWT',
    challenge: 'challenge',
    domain: 'pkiAuth.com',
    redirect_uri: 'redirect_uri',
  };

  let query = '?';
  Object.keys(param).forEach((k) => {
    query += `${k}=${param[k]}&`;
  });
  query = query.slice(0, query.length - 1);
  res.redirect(`http://localhost:8080/login${query}`);
};
const getCredential = (req, res) => {
  try {
    const token = req.query.token;
    logger.debug('issued token', token);
    if (!token) {
      throw new Error('Token is not passed');
    }
    jwt.verify(token, jwtSecret, async (err, data) => {
      if (err) res.status(403).send({ status: 403, message: 'Unauthorized.', error: null });
      const user = new User({ ...data });
      const userindbstr = await user.fetch({
        email: user.email,
        publicKey: user.publicKey,
      });
      if (!userindbstr) throw new Error(`User ${user.email} invalid`);
      const vc = await user.generateCredential();

      // create temporary dir
      const vcDir = path.join(__dirname + '/../' + 'temp/');
      if (!fs.existsSync(vcDir)) {
        fs.mkdirSync(vcDir);
      }

      // create
      const filePath = path.join(vcDir + vc['id'] + '.json');
      await store(vc, filePath);
      // activate this user
      await user.update();

      // send vc to download.
      res.download(filePath);
      // res.status(200).send({ status: 200, message: vc, error: null })
    });
  } catch (e) {
    res.status(500).send({ status: 500, message: null, error: e });
  }
};

async function verifyVP(vp, challenge) {
  logger.info('authContrl:: verifyVP() method start...');
  if (!vp) throw new Error('vp is null');
  const vc = vp.verifiableCredential[0];
  const isVerified = (await hypersignSDK.credential.verifyPresentation({
    presentation: vp,
    challenge,
    issuerDid: vc.issuer,
    holderDid: vc.credentialSubject.id,
  })) as any;
  logger.info('authContrl:: verifyVP() method isVerified', isVerified);

  if (isVerified.verified) {
    return true;
  } else {
    return false;
  }
}

const login = async (req: Request, res: Response) => {
  try {
    const challengeExtractedFromChToken = res.locals.data ? res.locals.data.challenge : '';
    const { proof } = req.body;

    if (!proof) throw new Error('Proof property must be passed in the request');

    // First check is user exist (make sure to check if he is active too)
    const userObj = new User({ ...req.body });
    let userindb = await userObj.fetch({
      email: userObj.email,
      publicKey: userObj.publicKey,
      isActive: '1',
    });
    if (!userindb) throw new Error(`User ${userObj.email} does exists or has not been validated his email.`);

    // verify the verifiable presentation
    logger.debug(`Before verifying the proof, ch = ${challengeExtractedFromChToken}`);
    if (await verifyVP(JSON.parse(proof), challengeExtractedFromChToken)) {
      userindb = JSON.parse(userindb);
      userindb['id'] = userindb['publicKey']; // TODO: handle it with better way:  add another property (i.e. did)in the model (may be) that will help
      jwt.sign(userindb, jwtSecret, { expiresIn: jwtExpiryInMilli }, (err, token) => {
        if (err) throw new Error(err);
        res.status(200).send({
          status: 200,
          message: {
            m: 'Sussfully loggedIn',
            jwtToken: token,
            user: userindb,
          },
          error: null,
        });
      });
    } else {
      logger.debug('Proof could not verified');
      throw new Error('Unauthorized: Proof can not be verified!');
    }
  } catch (e) {
    res.status(500).send({ status: 500, message: null, error: e });
  }
};

const recover = (req: Request, res: Response) => {
  logger.debug('Recover ap called');
  res.send('Recover ap called!');
};

const getNewChallenge = (req: Request, res: Response) => {
  logger.info('In the challenge api');
  logger.info('authContrl:: getNewChallenge() method start...');

  const challenge = hypersignSDK.did.getChallange();
  jwt.sign({ challenge }, jwtSecret, { expiresIn: jwtExpiryInMilli }, (err, token) => {
    if (err) throw new Error(err);
    res.status(200).send({
      status: 200,
      message: {
        JWTChallenge: token,
        challenge,
      },
      error: null,
    });
  });
  // res.status(200).send({ status: 200, message: getChallange() });
};

export default {
  check,
  login,
  recover,
  getNewChallenge,
  getCredential,
};
