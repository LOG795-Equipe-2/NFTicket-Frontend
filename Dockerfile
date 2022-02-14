# syntax=docker/dockerfile:1

# syntax=docker/dockerfile:1
FROM node:16.14 AS builder

WORKDIR /app

# Copy package.json to only restart that step when there are changes to the packages instead of the whole codebase.
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install

# Copy source code
COPY . .

# Build project
RUN npm run build

# Use Nginx as our web server
FROM nginx:1.20

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build .

ENTRYPOINT ["nginx", "-g", "daemon off;"]