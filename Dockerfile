FROM node:16-alpine3.14

WORKDIR /app

COPY package.json /app 
COPY yarn.lock /app
RUN yarn install 
RUN yarn build
COPY . /app 

CMD [ "node", "dist/server" ]