import EnvProvider from 'jvjr-docker-env'
const hsdk = require('lds-sdk')

const config = {
    studioServer: {
        BASE_URL: EnvProvider.value('STUDIO_SERVER_BASE_URL'),
        SAVE_SCHEMA_EP: EnvProvider.value('STUDIO_SERVER_SAVE_SCHEMA')||"api/v1/schema/issue",
        CRED_LIST_EP: EnvProvider.value('STUDIO_SERVER_CRED_LIST_EP') || "api/credential/list",
        SCHEMA_LIST_EP:EnvProvider.value('SCHEMA_LIST_EP')|| 'api/v1/schema/get',
        CRED_ISSUE_EP: EnvProvider.value('STUDIO_SERVER_CRED_ISSUE_EP') || "api/credential/issue",
        AUTH_CHALLENGE_EP: EnvProvider.value('STUDIO_SERVER_AUTH_CHALLENGE_EP') || "api/auth/challenge",
        AUTH_LOGIN_EP: EnvProvider.value('STUDIO_SERVER_AUTH_LOGIN_EP') || "api/auth/login"
    },
    nodeServer: {
        BASE_URL: EnvProvider.value('NODE_SERVER_BASE_URL'),
        NETWORK_STATUS_EP: EnvProvider.value('NODE_SERVER_NETWORK_STATUS_EP') || "net_info",
        SCHEMA_LIST_EP: EnvProvider.value('NODE_SERVER_SCHEMA_LIST_EP') || "api/schema/list",
        SCHEMA_GET_EP: EnvProvider.value('NODE_SERVER_SCHEMA_GET_EP') || "api/schema/get",
        SCHEMA_CREATE_EP: EnvProvider.value('NODE_SERVER_SCHEMA_CREATE_EP') || "api/schema/create",
        DID_RESOLVE_EP: EnvProvider.value('NODE_SERVER_DID_RERSOLVE_EP') || "api/did/resolve/"
    },
    explorer: {
        BASE_URL: EnvProvider.value('EXPLORER_BASE_URL'),
        NEW_DID_EP: EnvProvider.value('EXPLORER_NEW_DID_EP') || "newdid"
    },
    app: {
        name: EnvProvider.value('TITLE') || "Hypersign Studio",
        decription: EnvProvider.value('DESC'),
        version: EnvProvider.value('VERSION')
    },

}
const websocketUrl="ws://localhost:9000/"
const webWalletAddress="https://wallet-stage.hypersign.id"

const options = { nodeUrl: config.nodeServer.BASE_URL, didScheme: "did:hs" }
const hypersignSDK = {
    did: hsdk.did(options),
    credential: hsdk.credential(options)
}
config['appName']='Studio'
config['hypersignSDK'] = hypersignSDK
config['websocketUrl']=websocketUrl
config['webWalletAddress']=webWalletAddress
export default config