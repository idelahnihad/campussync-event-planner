FROM node:20-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends curl ca-certificates \
  && curl -fsSL https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-debian12-7.0.14.tgz -o /tmp/mongodb.tgz \
  && mkdir -p /tmp/mongodb \
  && tar -xzf /tmp/mongodb.tgz -C /tmp/mongodb --strip-components=1 \
  && cp /tmp/mongodb/bin/mongod /usr/local/bin/mongod \
  && rm -rf /tmp/mongodb /tmp/mongodb.tgz \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build && npm run build:server \
  && mkdir -p /data/db

ENV NODE_ENV=production
ENV PORT=3000
ENV MONGODB_URI=mongodb://127.0.0.1:27017/campussync
EXPOSE 3000

CMD ["sh", "-c", "mongod --dbpath /data/db --bind_ip 127.0.0.1 --logpath /var/log/campussync-mongod.log --fork && node dist/boot.js"]
