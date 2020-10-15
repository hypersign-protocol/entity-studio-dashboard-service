import { Request, Response } from 'express';
import { User } from '../services/user.service';
import IUser from '../models/IUser'
import { logger, jwtSecret, jwtExpiryInMilli, mail, port, host } from '../config'
import jwt from 'jsonwebtoken';
import { hypersignSDK } from '../config';
import { retrive, store } from '../utils/file'
import path from 'path'
import fs from 'fs'
import regMailTemplate from '../mailTemplates/registration';
import { MailService } from '../services/mail.service'
import QRCode from 'qrcode';

const TEMP_CREDENTIAL_DIR = path.join(__dirname + "/../" + "temp/")

const check = (req: Request, res: Response) => {
    const param = {
        chJWT: "chJWT",
        challenge: "challenge",
        domain: "pkiAuth.com",
        redirect_uri: "redirect_uri"
    }

    let query = "?";
    Object.keys(param).forEach((k) => {
        query += `${k}=${param[k]}&`
    })
    query = query.slice(0, query.length - 1)
    res.redirect(`http://localhost:8080/login${query}`)
}

const register_old = async (req: Request, res: Response) => {
    try {
        logger.debug(req.body)
        const body: IUser = req.body
        const user = new User({ ...body })
        // if(user.publicKey == "") throw new Error("PublicKey field can not be null")
        const userindbstr = await user.fetch()
        if (userindbstr) throw new Error(`User ${user.publicKey} already exists`)
        const createdU = await user.create();
        res.status(200).send({ status: 200, message: createdU, error: null })
    } catch (e) {
        res.status(500).send({ status: 500, message: null, error: e.message })
    }
}

const generateVCQRcode = async (data) => {
    return await QRCode.toDataURL(data);
}   

const register = async (req: Request, res: Response) => {
    try {
        console.log(req.body)
        logger.debug(req.body)
        const body: IUser = req.body
        const user = new User({ ...body })
        const userindbstr = await user.fetch({
            email: user.email,
            publicKey: user.publicKey
        })
        if (userindbstr) throw new Error(`User ${user.email} already exists. Please login with Hypersign Credential`)

        // will use the publicKey field for storing did
        // Generate Verifiable credential for this 
        const createdU = await user.create();
        const userData = JSON.parse(createdU);
        jwt.sign(
            userData,
            jwtSecret,
            { expiresIn: jwtExpiryInMilli },
            async (err, token) => {
                if (err) throw new Error(err)
                let link = `http://${host}:${port}/api/auth/credential?token=${token}`
                const mailService = new MailService({ ...mail });
                let mailTemplate = regMailTemplate;
                mailTemplate = mailTemplate.replace('@@RECEIVERNAME@@', user.fname)
                mailTemplate = mailTemplate.replace('@@LINK@@', link)

                // Send link as QR as well
                link = `${link}&fromQR=true`;
                const QRUrl = await generateVCQRcode(link);
                mailTemplate = mailTemplate.replace("@@QRURL@@", QRUrl);

                try {
                    //TODO: Send email
                    logger.debug('Before sending the mail')
                    const info = await mailService.sendEmail(user.email, mailTemplate, "Account Registration | Hypersign Studio")
                    logger.debug('Mail is sent ' + info.messageId)
                    res.status(200).send({
                        status: 200,
                        message: info,
                        error: null
                    })
                } catch (e) {
                    throw new Error(`Could not send email to ${user.email}. Please check the email address properly.`)
                }
            })
    } catch (e) {
        res.status(500).send({ status: 500, message: null, error: e.message })
    }
}

const getCredential = (req, res) => {
    try {
        const token = req.query.token;
        const fromQR = req.query.fromQR;
        console.log(token)
        if (!token) {
            throw new Error("Token is not passed")
        }
        jwt.verify(token, jwtSecret, async (err, data) => {
            if (err) res.status(403).send({ status: 403, message: "Unauthorized.", error: null })
            const user = new User({ ...data })
            const userindbstr = await user.fetch({
                email: user.email,
                publicKey: user.publicKey
            })
            if (!userindbstr) throw new Error(`User ${user.email} invalid`)
            const vc = await user.generateCredential();

            // create temporary dir
            const vcDir = TEMP_CREDENTIAL_DIR
            if (!fs.existsSync(vcDir)) {
                fs.mkdirSync(vcDir);
            }

            // create 
            const filePath = path.join(vcDir + vc['id'] + ".json");
            await store(vc, filePath);
            // activate this user
            await user.update();

            // send vc to download.
            if(fromQR){
                res.status(200).send({ status: 200, message: vc, error: null })
            }else{
                res.download(filePath);
            }
        })
    } catch (e) {
        res.status(500).send({ status: 500, message: null, error: e.message })
    }

}

async function verifyVP(vp, challenge) {
    if (!vp) throw new Error('vp is null')
    const vc = vp.verifiableCredential[0]
    const isVerified = await hypersignSDK.credential.verifyPresentation({
        presentation: vp,
        challenge,
        issuerDid: vc.issuer,
        holderDid: vc.credentialSubject.id
    }) as any;
    console.log(isVerified)
    if (isVerified.verified) {
        return true
    } else {
        return false
    }
}

const login = async (req: Request, res: Response) => {
    try {
        const challengeExtractedFromChToken = res.locals.data ? res.locals.data.challenge : "";
        let { proof } = req.body;

        if (!proof) throw new Error('Proof property must be passed in the request')

        // First check is user exist (make sure to check if he is active too)
        let userObj = new User({ ...req.body })
        let userindb = await userObj.fetch({
            email: userObj.email,
            publicKey: userObj.publicKey,
            isActive: "1"
        })
        if (!userindb) throw new Error(`User ${userObj.email} does exists or has not been validated his email.`)

        // verify the verifiable presentation
        logger.debug(`Before verifying the proof, ch = ${challengeExtractedFromChToken}`)
        if (await verifyVP(JSON.parse(proof), challengeExtractedFromChToken)) {
            userindb = JSON.parse(userindb)
            userindb['id'] = userindb['publicKey'] // TODO: handle it with better way:  add another property (i.e. did)in the model (may be) that will help
            jwt.sign(
                userindb,
                jwtSecret,
                { expiresIn: jwtExpiryInMilli },
                (err, token) => {
                    if (err) throw new Error(err)
                    res.status(200).send({
                        status: 200, message: {
                            m: "Sussfully loggedIn",
                            jwtToken: token,
                            user: userindb
                        }, error: null
                    })
                })
        } else {
            logger.debug('Proof could not verified')
            throw new Error("Unauthorized: Proof can not be verified!")
        }
    } catch (e) {
        res.status(500).send({ status: 500, message: null, error: e.message })
    }
}


const recover = (req: Request, res: Response) => {
    logger.debug('Recover ap called')
    res.send('Recover ap called!')
}

const getNewChallenge = (req: Request, res: Response) => {
    console.log('In the challenge api')
    const challenge = hypersignSDK.did.getChallange();
    jwt.sign(
        { challenge },
        jwtSecret,
        { expiresIn: jwtExpiryInMilli },
        (err, token) => {
            if (err) throw new Error(err)
            res.status(200).send({
                status: 200, message: {
                    JWTChallenge: token,
                    challenge
                }, error: null
            })

        })
    // res.status(200).send({ status: 200, message: getChallange() });
}

export default {
    check,
    register,
    login,
    recover,
    getNewChallenge,
    getCredential
}