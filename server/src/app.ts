import express, { Application, Request, Response } from 'express';
import cors from 'cors';
const HIDWallet = require('hid-hd-wallet');
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { walletAuthRoutes } from './routes/walletAuth'
import { port, logger } from './config';
import authRoutes from './routes/auth';
import blogRoutes from './routes/blog';
import appRoutes from './routes/app';
import { credentialRoutes } from './routes/verifiableCredentials';
import db from './dbConn';
import path from 'path'
import http from 'http'
import { schemaRoutes } from './routes/schemaRoutes';
const HypersignAuth = require('hypersign-auth-node-sdk')
export default function app() {
    db.openConnection()
        .then(e => {
            logger.info(e);

        }).catch(e => {
            logger.info(e);

        })
    const app = express();
    let hypersign
    const server = http.createServer(app)
    const mnemonic = "retreat seek south invite fall eager engage endorse inquiry sample salad evidence express actor hidden fence anchor crowd two now convince convince park bag"
    const walletOptions = {
        hidNodeRPCUrl: 'https://jagrat.hypersign.id/node1/rpc/',
        hidNodeRestUrl: 'https://jagrat.hypersign.id/node1/rest/',
    };

    const whitelistedUrls = ["http://localhost:9000", "http://localhost:9001", "https://wallet-stage.hypersign.id" ,"undefined" , "*" ,"http://localhost:4999"]

    function corsOptionsDelegate(req, callback) {
        let corsOptions;

        if (whitelistedUrls.indexOf(req.header('Origin')) !== -1) {
            corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
        } else {
            corsOptions = { origin: false } // disable CORS for this request
        }
        callback(null, corsOptions) // callback expects two parameters: error and options
    }





    const hidWalletInstance = new HIDWallet(walletOptions);
    hidWalletInstance.generateWallet({ mnemonic }).then(async () => {
        hypersign = new HypersignAuth(server, hidWalletInstance.offlineSigner)
        await hypersign.init();
        app.use(express.static('public'))

        app.use(express.json());
        app.use(cors(corsOptionsDelegate));
        app.use(cookieParser());
        app.use(express.json());
        app.use(express.static('public'));
      
       

        app.use('/api/app', appRoutes)
        app.use('/api/auth', authRoutes)
        app.use('/api/blog', blogRoutes)
        app.use('/api/v1/credential', credentialRoutes(hypersign))
        app.use('/api/v1/schema', schemaRoutes(hypersign))

        app.use(walletAuthRoutes(hypersign))



        server.listen(port, () => logger.info(`The server is running on port ${port}`));
        process.on('SIGINT', function () {
            db.closeConnection().then(() => {
                logger.info('Process (SIGINT) :: Mongoose default connection disconnected through app termination');
                process.exit(1);
            });

        });


    })
        .catch(e => {
            console.error(e)
        })



}
