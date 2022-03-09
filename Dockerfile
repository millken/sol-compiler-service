FROM 16-alpine3.14

WORKDIR /app

COPY package.json /app 
COPY yarn.lock /app
RUN yarn install 
COPY . /app 

CMD [ "node", "dist/server" ]