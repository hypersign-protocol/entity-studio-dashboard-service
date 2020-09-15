## Client

### Manul Setup

If do not want to setup manul, then skip to the docker [section](#or-simply-use-docker-container). 

```js
git clone https://github.com/hypersign-protocol/studio #Pull the studio repo
cd studio/client
npm i
```

### Run

#### Dev env

```bash
npm run dev
```

#### Prod env

```bash
npm run setEnv
npm run serve
```

Make sure you change the env var as per your requirement.

### Build

```bash
npm run build
```

## Or Simply Use Docker Container

### Pull the image

```bash
docker pull hypersignprotocol/studio-client
```

### Run container

Cone the repo and change directory

```bash
git clone https://github.com/hypersign-protocol/studio #Pull the studio repo
cd studio/client
```

Now run the container. 

```bash
docker run -it -v ${PWD}:/app -v /app/node_modules -p 9001:9001 hypersignprotocol/studio-client
```
We are mounting the current directory for source code and running the container. 


## With Env Variable at run time

### Build

```bash
docker build -f Dockerfile-env -t hypersignprotocol/studio-client:env .
```

### Pull

```bash
docker pull hypersignprotocol/studio-client:env
```

### Run

```bash
docker run -it --env VUE_APP_TITLE="HS Studio Test Application"  -p 9001:9001 hypersignprotocol/studio-client:env
```


--- 

* On success full run, the app will run on [`http://localhost:9001/`]().
* [Ref](https://shekhargulati.com/2019/01/18/dockerizing-a-vue-js-application/)


