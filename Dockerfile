FROM mhart/alpine-node:10
MAINTAINER Scott Traver

WORKDIR /app
COPY . .

RUN npm install --production

EXPOSE 5000
CMD ["node", "server.js"]
