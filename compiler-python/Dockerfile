FROM node:16

EXPOSE 3004

WORKDIR /app

RUN npm i npm@latest -g

COPY package.json package-lock.json ./

RUN npm install
RUN npm install --save uuid
RUN npm install cors
RUN apt-get update && apt-get install python3

COPY . .

CMD [ "npm", "start" ]