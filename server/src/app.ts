import express, { Application, Request, Response } from 'express';
import cors from 'cors';
const HIDWallet = require('hid-hd-wallet');
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { walletAuthRoutes } from './routes/walletAuth';
import {
  port,
  logger,
  walletOptions,
  mnemonic,
  schemaId,
  studioServerBaseUrl,
  jwtSecret,
  jwtExpiryInMilli,
} from './config';
import authRoutes from './routes/auth';
import blogRoutes from './routes/blog';
import appRoutes from './routes/app';
import { credentialRoutes } from './routes/verifiableCredentials';
import db from './dbConn';
import http from 'http';
import { schemaRoutes } from './routes/schemaRoutes';
import { presentationRoute, presentationRequestRoute } from './routes/presentationRoutes';
import apiResponseHandler from './response/apiResponseHandler';
import { profileRoute } from './routes/userProfile';
import { corsOptionsDelegate } from './utils/https';
import { orgRoutes } from './routes/orgRoutes';
const HypersignAuth = require('hypersign-auth-node-sdk');
export default function app() {
  db.openConnection()
    .then((e) => {
      logger.info(e);
    })
    .catch((e) => {
      logger.info(e);
    });
  const app = express();
  let hypersign;
  const server = http.createServer(app);

  const hidWalletInstance = new HIDWallet(walletOptions);
  const hypersignAuthOptions = {
    serviceName: 'Entity Studio Dashboard',
    serviceEp: studioServerBaseUrl,
    schemaId,
    accessToken: {
      secret: jwtSecret,
      expiryTime: jwtExpiryInMilli,
    },
    refreshToken: {
      secret: jwtSecret,
      expiryTime: jwtExpiryInMilli,
    },
    networkUrl: walletOptions.hidNodeRPCUrl,
    networkRestUrl: walletOptions.hidNodeRestUrl,
  };
  hidWalletInstance
    .generateWallet({ mnemonic })
    .then(async () => {
      hypersign = new HypersignAuth(server, hidWalletInstance.offlineSigner, hypersignAuthOptions);
      await hypersign.init();
      app.use(express.static('public'));

      app.use(express.json());
      app.use(cookieParser());
      app.use(express.json());
      app.use(express.static('public'));
      app.get('/api/health', async (req, res, next) => {
        res.json({ status: 'OK' });
      });
      app.use('/api/app', appRoutes);
      app.use('/api/auth', authRoutes);
      app.use('/api/blog', blogRoutes);
      app.use('/api/v1/presentation/request', cors(), presentationRequestRoute());
      app.use(cors(corsOptionsDelegate));
      app.use('/api/v1/presentation', presentationRoute(hypersign));
      app.use('/api/v1/credential', credentialRoutes(hypersign));
      app.use('/api/v1/schema', schemaRoutes(hypersign));
      app.use('/api/v1/org', orgRoutes(hypersign));
      app.use(walletAuthRoutes(hypersign));
      app.use('/api/v1/user', profileRoute(hypersign));
      app.use(apiResponseHandler);

      server.listen(port, () => logger.info(`The server is running on port ${port}`));
      process.on('SIGINT', function () {
        db.closeConnection().then(() => {
          logger.info('Process (SIGINT) :: Mongoose default connection disconnected through app termination');
          process.exit(1);
        });
      });
    })
    .catch((e) => {
      logger.error(e);
    });
}
