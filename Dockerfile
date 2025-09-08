FROM node:18-alpine


WORKDIR /app


COPY client/package*.json ./client/
COPY server/package*.json ./server/

RUN cd client && npm install
RUN cd server && npm install

COPY client/ ./client/
COPY server/ ./server/


EXPOSE 3000 5000

CMD ["sh", "-c", "cd client && npm run dev & cd server && npm run dev"]