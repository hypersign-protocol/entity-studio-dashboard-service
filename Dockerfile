FROM node:16
WORKDIR /usr/src/app
COPY ./package.json .
COPY ./tsconfig.json .
COPY . .
RUN npm install
RUN npm run build
CMD ["npm","run", "start"]




