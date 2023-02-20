FROM node:buster-slim

RUN apt update
RUN apt install -y curl

RUN mkdir /script
COPY ./secret.sh /script
RUN chmod +x /script/secret.sh

WORKDIR /app

COPY ./package.json .
RUN npm i --force

COPY . /app

RUN npm run build

HEALTHCHECK CMD curl --fail http://localhost:3000/ || exit 1