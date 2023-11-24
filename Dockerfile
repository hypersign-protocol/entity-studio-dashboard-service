FROM node:16
WORKDIR /usr/src/app
ADD ./server/ /usr/src/app/
RUN npm cache clean --force
RUN npm install
CMD ["npm","run", "dev"]
