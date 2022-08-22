import express, { Application, Request, Response } from 'express';
import cors from 'cors';
const HIDWallet = require('hid-hd-wallet');
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
const authRoutes = require('./routes/routes')
import { port, logger } from './config';
// import authRoutes from './routes/auth';
import blogRoutes from './routes/blog';
import appRoutes from './routes/app';
import vcRoutes from './routes/verifiableCredentials'
import path from 'path'
import http from 'http'
const HypersignAuth = require('hypersign-auth-node-sdk')
export default function app() {
    const app = express();
    let hypersign
    const server = http.createServer(app)
    const mnemonic = "retreat seek south invite fall eager engage endorse inquiry sample salad evidence express actor hidden fence anchor crowd two now convince convince park bag"
    const walletOptions = {
        hidNodeRPCUrl: 'https://jagrat.hypersign.id/node1/rpc/',
        hidNodeRestUrl: 'https://jagrat.hypersign.id/node1/rest/',
    };

    const whitelistedUrls = ["http://localhost:9000", "*", "https://wallet-stage.hypersign.id"]

    function corsOptionsDelegate(req, callback) {
        let corsOptions;
        console.log(req.header('Origin'));

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
        console.log( hypersign.authenticate)
          await hypersign.init();
        console.log('Hypersign Auth service has been initialized')


        app.use(express.json());
        app.use(cors(corsOptionsDelegate));
        app.use(cookieParser());
        app.use(express.json());
        app.use(express.static('public'));



        app.use('/api/app', appRoutes)
        app.use('/api/auth', authRoutes)
        app.use('/api/blog', blogRoutes)
        app.use('/api/credential', vcRoutes)
        app.get('/', (req, res) => { res.json("helllo") })

        app.use(authRoutes(hypersign))
        app.post('/hs/api/v2/auth', hypersign.authenticate.bind(hypersign), (req, res) => {
            try {
                const { user } = req.body.hypersign.data;
                console.log(req.body.hypersign.data)
                    // Do something with the user data.
                    // The hsUserData contains userdata and authorizationToken
                res.status(200).send({ status: 200, message: "Success", error: null });
            } catch (e) {
                res.status(500).send({ status: 500, message: null, error: e.message });
            }
        })
    

        server.listen(port, () => logger.info(`The server is running on port ${port}`));



    })
        .catch(e => {
            console.error(e)
        })



}
