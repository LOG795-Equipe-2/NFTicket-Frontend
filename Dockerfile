# syntax=docker/dockerfile:1

# syntax=docker/dockerfile:1
FROM node:16.14 AS builder

WORKDIR /app

COPY ["yarn.lock", "package.json", "./"]
RUN yarn install --frozen-lockfile --network-timeout 1000000

# Copy source code
COPY . .

# Build project
RUN yarn run build

# Use Nginx as our web server
FROM nginx:1.20

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build .

ENTRYPOINT ["nginx", "-g", "daemon off;"]