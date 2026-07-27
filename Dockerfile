FROM public.ecr.aws/docker/library/node:22

ARG TIMESTAMP
ENV IMAGES_CDN_DOMAIN=https://images.xianbridal.co.nz
ENV TIMESTAMP=$TIMESTAMP
ENV NODE_ENV=production
ENV PORT=8080

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN npm install --include=dev
RUN npm run build
RUN npm prune --omit=dev

EXPOSE 8080
CMD [ "npm", "start" ]
