FROM node:20.1.0-alpine3.17

WORKDIR /app-backend

COPY package*.json ./

RUN apk add --no-cache python3

RUN apt-get update && apt-get install -y build-essential

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm run dev"]