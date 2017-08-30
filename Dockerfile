FROM node:8

ARG NPM_TOKEN
WORKDIR /app

COPY .npmrc package.json ./
RUN npm install --production

ADD . .
RUN npm run postinstall