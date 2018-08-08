FROM node:6

WORKDIR /usr/src/app

VOLUME .:/usr/src/app

RUN npm install -g nodemon

EXPOSE 3000

CMD npm start
