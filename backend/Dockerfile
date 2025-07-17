FROM node:18

WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY package.json .

RUN npm install

RUN npm install -g nodemon

COPY . .

EXPOSE 3000

CMD ["nodemon", "--legacy-watch", "app.js"]