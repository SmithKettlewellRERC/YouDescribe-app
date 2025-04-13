FROM node:14

WORKDIR /home/youdescribe
COPY ./ ./

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

RUN npm install
RUN npm rebuild node-sass
RUN npm run build:prod

EXPOSE 3000
CMD [ "node", "./server" ]
