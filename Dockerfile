FROM node:12

# setting up the working dir
WORKDIR /usr/src/app

# # setting up env var from .env file
# COPY ./server/env.staging ./server/
# COPY ./client/env.staging ./client/
# RUN /bin/bash -c "source /usr/src/app/client/.env.staging"
# RUN /bin/bash -c "source /usr/src/app/server/.env.staging"

# pushing the code inside
ADD . /usr/src/app

# setting up the project
RUN chmod +x ./re-buildall.sh
RUN ./re-buildall.sh
CMD ["node", "server/dist/index.js"]

