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