const env = require('dotenv')
const hsdk = require('lds-sdk')

env.config();

const config = {
    studioServer: {
        BASE_URL: process.env.VUE_APP_STUDIO_SERVER_BASE_URL || "http://localhost:9000/",
        CRED_LIST_EP: process.env.VUE_APP_STUDIO_SERVER_CRED_LIST_EP || "api/credential/list",
        CRED_ISSUE_EP: process.env.VUE_APP_STUDIO_SERVER_CRED_ISSUE_EP || "api/credential/issue",
        AUTH_CHALLENGE_EP: process.env.VUE_APP_STUDIO_SERVER_AUTH_CHALLENGE_EP || "api/auth/challenge",
        AUTH_LOGIN_EP: process.env.VUE_APP_STUDIO_SERVER_AUTH_LOGIN_EP || "api/auth/login"
    },
    nodeServer: {
        BASE_URL: process.env.VUE_APP_NODE_SERVER_BASE_URL || "http://localhost:5000/",
        NETWORK_STATUS_EP: process.env.VUE_APP_NODE_SERVER_NETWORK_STATUS_EP || "network/info",
        SCHEMA_LIST_EP: process.env.VUE_APP_NODE_SERVER_SCHEMA_LIST_EP || "api/schema/list",
        SCHEMA_GET_EP: process.env.VUE_APP_NODE_SERVER_SCHEMA_GET_EP || "api/schema/get",
        SCHEMA_CREATE_EP: process.env.VUE_APP_NODE_SERVER_SCHEMA_CREATE_EP || "api/schema/create",
        DID_RESOLVE_EP: process.env.VUE_APP_NODE_SERVER_DID_RERSOLVE_EP || "api/did/resolve/"
    },
    explorer: {
        BASE_URL: process.env.VUE_APP_EXPLORER_BASE_URL || "http://localhost:5001/",
        NEW_DID_EP: process.env.VUE_APP_EXPLORER_NEW_DID_EP || "explorer/newdid"
    },
    app: {
        name: process.env.VUE_APP_TITLE || "Hypersign Studio",
        decription: process.env.VUE_APP_DESC || "A portal to issue and verify credentials on Hypersign Identity network!",
        version: process.env.VUE_APP_VERSION || "v1.0"
    },

}
// const options = { nodeUrl: config.nodeServer.BASE_URL, didScheme: "did:hs" }
const options = { nodeUrl: "http://localhost:5000",  didScheme:  "did:v2:hs"}
console.log(options)
const hypersignSDK = {
    did: hsdk.did(options),
    credential: hsdk.credential(options)
}
config['hypersignSDK'] = hypersignSDK

module.exports = config