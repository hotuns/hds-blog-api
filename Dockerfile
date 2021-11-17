FROM node:12

WORKDIR /app
COPY package*.json ./

RUN npm install --registry=https://registry.npm.taobao.org
RUN npm install -g nodemon

