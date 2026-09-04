FROM oven/bun:latest

#cd /app
WORKDIR /app

#This copies your root:

#package.json
#bun.lock

#into the container at:

#/app/package.json
#/app/bun.lock

COPY package.json bun.lock ./

COPY apps ./apps
COPY packages ./packages

RUN bun install --frozen-lockfile

WORKDIR /app/apps/websocket

EXPOSE 3001

CMD ["bun", "run", "index.ts"]


