FROM node:12

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN npm run webpack

CMD ["npm", "start"]