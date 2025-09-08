FROM node:18-alpine

WORKDIR /app


COPY client/package*.json ./client/
COPY server/package*.json ./server/


RUN cd client && npm install && chmod -R 755 node_modules/.bin/
RUN cd server && npm install && chmod -R 755 node_modules/.bin/


COPY client/ ./client/
COPY server/ ./server/


RUN chmod -R 755 /app/client/node_modules/.bin/
RUN chmod -R 755 /app/server/node_modules/.bin/

EXPOSE 3000 5000

CMD ["sh", "-c", "cd server && npm run dev & cd client && npm run dev && fg"]