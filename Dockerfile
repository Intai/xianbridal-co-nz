FROM public.ecr.aws/bitnami/node:14

ENV IMAGES_CDN_DOMAIN=https://images.xianbridal.co.nz
ENV CONTAINER_IMAGE=$CODEBUILD_BUILD_NUMBER
ENV NPM_CONFIG_PRODUCTION=false
ENV NODE_ENV=production
ENV PORT=8080

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN npm config set user 0
RUN npm install --production=false
RUN npm run build
RUN npm prune

EXPOSE 8080
CMD [ "npm", "start" ]
