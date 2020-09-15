## Server

### Pre-requisite

* You must setup the [core](https://github.com/hypersign-protocol/core) project before proceeding.
* Make sure you build the client project first. Follow instructions [here](../client/README.md#build) to build the client app.
* NPM and Node is required.

### Setup and Building

```bash
cd server
npm i
npm run setup // to setup env and database
npm run start  // to run the server
npm run dev // to run the server in dev env
```

The server runs on port `9000`. Please look into `.env` file to change paramaters. 

### Docker

#### Building the image

```bash
docker build -t hypersignprotocol/studio-server .
```

#### Running the container

```bash
docker run \
    --env PORT=9000 \
    --env LOG_FILEPATH="../log/studio-server.log" \
    --env LOG_DIR="./log" \
    --env LOG_TIMESTAMP_FORMAT="YYYY-MM-DD HH:mm:ss.SSS" \
    --env LOG_LEVEL="debug" \
    --env DATABASE_FILEPATH="../db/studio-server.db" \
    --env JWT_SECRET="my\$ecreEtKeY@123" \
    -p 9000:9000 hypersignprotocol/studio-server
```


