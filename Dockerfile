FROM node:18-alpine


WORKDIR /app


COPY client/package*.json ./client/
COPY server/package*.json ./server/

RUN cd client && npm install
RUN cd server && npm install

COPY client/ ./client/
COPY server/ ./server/


COPY client/.env ./client/
COPY server/.env ./server/


EXPOSE 3000 5000


CMD ["sh", "-c", "cd server && npm run dev & cd client && npm run dev && fg"]