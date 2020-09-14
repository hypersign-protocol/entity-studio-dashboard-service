FROM node:12

# setting up the working dir
WORKDIR /usr/src/app

COPY ./server/.env.staging ./server/
COPY ./client/.env.staging ./client/
RUN /bin/bash -c "source /usr/src/app/server/.env.staging"
RUN /bin/bash -c "source /usr/src/app/client/.env.staging"

# ENV VUE_APP_TITLE="Hypersign Studio (staging)" \
#     VUE_APP_DESC="A portal to issue and verify credentials on Hypersign Identity network!" \
#     STUDIO_SERVER_BASE_URL="http://localhost:9000/" \
#     STUDIO_SERVER_CRED_LIST_EP="api/credential/list" \
#     STUDIO_SERVER_CRED_ISSUE_EP="api/credential/issue" \
#     STUDIO_SERVER_AUTH_CHALLENGE_EP="api/auth/challenge" \
#     STUDIO_SERVER_AUTH_LOGIN_EP="api/auth/login" \
#     NODE_SERVER_BASE_URL="http://localhost:5000/" \
#     NODE_SERVER_SCHEMA_LIST_EP="api/schema/list" \
#     NODE_SERVER_SCHEMA_GET_EP="api/schema/get" \
#     NODE_SERVER_SCHEMA_CREATE_EP="api/schema/create" \
#     EXPLORER_BASE_URL="http://localhost:5001/" \
#     EXPLORER_NEW_DID_EP="explorer/newdid" \
#     PORT=9000 \
#     LOG_FILEPATH="../log/studio-server.log" \
#     LOG_DIR="./log" \
#     LOG_TIMESTAMP_FORMAT="YYYY-MM-DD HH:mm:ss.SSS" \
#     LOG_LEVEL="debug" \
#     DATABASE_FILEPATH="../db/studio-server.db" \
#     DID_METHOD_NAME='hs' \
#     DID_PREFIX="did" \
#     JWT_SECRET="my\$ecreEtKeY@123" 

# pushing the code inside
COPY server/package*.json ./server/
COPY client/package*.json ./client/
RUN  cd server && npm install && cd -
RUN  cd client && npm install && cd -
ADD . /usr/src/app

# setting up the project
RUN chmod +x ./build-docker.sh
RUN ./build-docker.sh
EXPOSE $PORT
CMD ["node", "server/dist/index.js"]

