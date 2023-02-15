FROM node:buster-slim

# RUN apt update

WORKDIR /app

COPY ./package.json .
RUN npm i --force

COPY . /app
RUN npm run build

