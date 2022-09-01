import { Router } from 'express'
import * as appCtrl from '../controllers/verifiableCredentialsController'



export const credentialRoutes = (hypersign) => {

    const router = Router();
    router.post('/issue',  hypersign.authorize.bind(hypersign), appCtrl.issueCredential)
    router.post('/status/:id',appCtrl.setCredentialStatus)
    router.get('/list/:orgDid',  hypersign.authorize.bind(hypersign), appCtrl.getCredentialList)
    router.post('/accepct',appCtrl.accepctCredential)
    router.get('/walletAccepct',appCtrl.accpctWalletCredential)
    return router
}








