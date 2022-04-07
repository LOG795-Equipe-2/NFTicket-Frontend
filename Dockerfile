# syntax=docker/dockerfile:1

# syntax=docker/dockerfile:1
FROM node:16.14 AS builder

WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]
RUN yarn

# Copy source code
COPY . .

# Build project
RUN yarn run build

# Use Nginx as our web server
FROM nginx:1.20

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build .

ENTRYPOINT ["nginx", "-g", "daemon off;"]