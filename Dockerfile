# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.12.0
FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /usr/src/app

COPY package.json ./package.json
COPY yarn.lock    ./yarn.lock

RUN apk update && \
    apk add --no-cache \
      git \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      dbus \
      xvfb

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN apk update && apk add --no-cache git \
  && yarn install

COPY . .

RUN yarn build

FROM node:${NODE_VERSION}-alpine AS runtime

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist      ./dist
COPY --from=build /usr/src/app/package.json ./package.json

RUN apk update && \
    apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      dbus \
      xvfb && \
    chown -R node:node /usr/src/app

RUN mkdir -p /tmp/.X11-unix && chmod 1777 /tmp/.X11-unix

USER node

# Configure Puppeteer to use the installed Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV DISPLAY=:99
ENV CHROME_BIN=/usr/bin/chromium-browser
ENV CHROME_PATH=/usr/lib/chromium/
ENV CHROME_FLAGS="--no-sandbox --disable-setuid-sandbox --disable-dev-shm-usage --disable-gpu --no-first-run --no-zygote --single-process --disable-extensions"

EXPOSE 3000
CMD Xvfb :99 -screen 0 1280x720x24 & sleep 2; find /var/sessions -name 'SingletonLock' -delete && node dist/index.js
