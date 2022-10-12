FROM node:latest

WORKDIR /app

COPY . /app

COPY package.json .

RUN npm install

EXPOSE 3002

CMD ["node", "server.js"]