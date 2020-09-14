FROM node:12

# setting up the working dir
WORKDIR /usr/src/app

# environment variables setup
COPY ./server/.env.staging ./server/
COPY ./client/.env.staging ./client/
RUN /bin/bash -c "source /usr/src/app/server/.env.staging"
RUN /bin/bash -c "source /usr/src/app/client/.env.staging"

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
CMD cd server && npm run start

