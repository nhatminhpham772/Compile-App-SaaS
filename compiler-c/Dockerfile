FROM node:16

EXPOSE 3001

WORKDIR /app

RUN npm i npm@latest -g

COPY package.json package-lock.json ./

RUN npm install
RUN npm install --save uuid
RUN npm install cors
RUN apt-get update && apt-get install -y gcc

COPY . .

CMD [ "npm", "start" ]