# studio

## Pre-requiisite

* You must setup the [core](https://github.com/hypersign-protocol/core) project before proceeding.
* Node js (`12+`) is required.
* NPM (`6.14+`) is required.

## Re build

```sh
./re-buildall.sh
```

What it does?

* It cleans the node modules and dists.
* It builds the client app
* It builds the server app (including database reset)

## Run the server

```sh
cd server
npm run start
```

The server will run at defualt port `:9000`. For more commands, please look at [this](./server/README.md) document

## Dokerization

### Build the image

```bash
docker build -t hypersignprotocol/studio:1.0.0 .
```

### Pull the image

```bash
docker pull hypersignprotocol/studio:1.0.0 
```

### Run the container

```bash
docker run -p 9000:9000 hypersignprotocol/studio:1.0.0
```

#### Run container with custom env vars

```bash
docker run --env \ 
    VUE_APP_TITLE="Hypersign Studio (staging)" \
    VUE_APP_DESC="A portal to issue and verify credentials on Hypersign Identity network!" \
    STUDIO_SERVER_BASE_URL="http://localhost:9000/" \
    STUDIO_SERVER_CRED_LIST_EP="api/credential/list" \
    STUDIO_SERVER_CRED_ISSUE_EP="api/credential/issue" \
    STUDIO_SERVER_AUTH_CHALLENGE_EP="api/auth/challenge" \
    STUDIO_SERVER_AUTH_LOGIN_EP="api/auth/login" \
    NODE_SERVER_BASE_URL="http://localhost:5000/" \
    NODE_SERVER_SCHEMA_LIST_EP="api/schema/list" \
    NODE_SERVER_SCHEMA_GET_EP="api/schema/get" \
    NODE_SERVER_SCHEMA_CREATE_EP="api/schema/create" \
    EXPLORER_BASE_URL="http://localhost:5001/" \
    EXPLORER_NEW_DID_EP="explorer/newdid" \
    PORT=9000 \
    LOG_FILEPATH="../log/studio-server.log" \
    LOG_DIR="./log" \
    LOG_TIMESTAMP_FORMAT="YYYY-MM-DD HH:mm:ss.SSS" \
    LOG_LEVEL="debug" \
    DATABASE_FILEPATH="../db/studio-server.db" \
    DID_METHOD_NAME='hs' \
    DID_PREFIX="did" \
    JWT_SECRET="my\$ecreEtKeY@123" 
    -p 9000:9000 hypersignprotocol/studio:1.0.0
```
