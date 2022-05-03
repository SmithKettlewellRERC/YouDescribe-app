FROM node:14

WORKDIR /home/dev.youdescribe.org
COPY ./ ./

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

RUN npm install

EXPOSE 3000
CMD [ "node", "./server" ]
