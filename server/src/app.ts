import express, { Application, Request, Response } from 'express';
import cors from 'cors';
const HIDWallet = require('hid-hd-wallet');
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { walletAuthRoutes } from './routes/walletAuth';
import { port, logger, walletOptions, mnemonic } from './config';
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
  hidWalletInstance
    .generateWallet({ mnemonic })
    .then(async () => {
      hypersign = new HypersignAuth(server, hidWalletInstance.offlineSigner);
      await hypersign.init();
      app.use(express.static('public'));

      app.use(express.json());
      // app.use(cors(corsOptionsDelegate));
      app.use(cookieParser());
      app.use(express.json());
      app.use(express.static('public'));

      app.use('/api/app', appRoutes);
      app.use('/api/auth', authRoutes);
      app.use('/api/blog', blogRoutes);
      app.use('/api/v1/presentation/request', presentationRequestRoute());
      app.use('/api/v1/presentation', cors(corsOptionsDelegate), presentationRoute(hypersign));
      app.use('/api/v1/credential', cors(corsOptionsDelegate), credentialRoutes(hypersign));
      app.use('/api/v1/schema', cors(corsOptionsDelegate), schemaRoutes(hypersign));
      app.use('/api/v1/org', cors(corsOptionsDelegate), orgRoutes(hypersign));
      app.use(cors(corsOptionsDelegate), walletAuthRoutes(hypersign));
      app.use('/api/v1/user', cors(corsOptionsDelegate), profileRoute(hypersign));
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
