FROM node:10-alpine

RUN mkdir -p /src/kiite-webservice/app
WORKDIR /src/kiite-webservice/app

COPY . /src/kiite-webservice/app

RUN npm install

ENV PORT=8080

EXPOSE 8080

CMD [ "node", "index" ]

