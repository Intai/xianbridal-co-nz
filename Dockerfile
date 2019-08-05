FROM node:carbon

ENV NPM_CONFIG_PRODUCTION=false
ENV NODE_ENV=production
ENV PORT=8080

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN npm install
RUN npm build
RUN npm prune --production

EXPOSE 8080
CMD [ "npm", "start" ]
