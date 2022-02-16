FROM node:14.18.2-alpine
ENV ENV_NAME dev

RUN apk add --no-cache --virtual .build-deps make gcc g++ python3 git

WORKDIR /usr/src/app
COPY package.json .
RUN npm install
ADD . /usr/src/app
CMD [ "npm", "start" ]
EXPOSE 3019