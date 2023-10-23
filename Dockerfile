FROM node:20 

WORKDIR /home/node/app

COPY package*.json ./

RUN npm i

COPY . .

ENV NODE_PATH=./build

RUN npm run build

ENTRYPOINT [ "npm", "run", "start" ]