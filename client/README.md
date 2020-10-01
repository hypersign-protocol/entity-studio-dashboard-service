# Studio-client

## Manual

### Install

If do not want to setup manul, then skip to the docker [section](#or-simply-use-docker-container). 

```bash
git clone https://github.com/hypersign-protocol/studio #Pull the repo
cd studio/client
npm i
```

### Build & Run

#### Prod

```bash
npm run build
npm run serve
```
Make sure you have `.env` file.

#### Dev

```bash
npm run dev
```
Make sure you have `.env.staging` file.

## Using docker container

### Build

```bash
docker build -t hypersignprotocol/studio-client:v1.0 .
```

### Pull

```bash
docker pull hypersignprotocol/studio-client:v1.0
```

### Run

```bash
docker run -it -p 9001:80 hypersignprotocol/studio-client:v1.0
```

### Enviroments Vars

* `VUE_APP_TITLE`: Title of application
* `VUE_APP_VERSION`: Version of application
* `VUE_APP_STUDIO_SERVER_BASE_URL`: Base url of studio server 
* `VUE_APP_NODE_SERVER_BASE_URL`: Base url of HS blockchain node
* `VUE_APP_EXPLORER_BASE_URL`: Url of explorer

```bash
docker run -it \
--env NODE_ENV="production" \
--env VUE_APP_TITLE="Studio" \
--env VUE_APP_VERSION="v1.0" \
--env VUE_APP_STUDIO_SERVER_BASE_URL=http://studio:9000/ \
--env VUE_APP_NODE_SERVER_BASE_URL=http://node:5000/ \
--env VUE_APP_EXPLORER_BASE_URL=http://explorer:5001/ \
-p 9001:80 hypersignprotocol/studio-client:v1.0
```

Note: If you do not pass `--env` options then all envs are taken from `.env` file.

-- 

* On success full run, the app will run on [`http://localhost:9001/`]().
* [Ref](https://shekhargulati.com/2019/01/18/dockerizing-a-vue-js-application/)


