# node-grpc-typescript

Solidity contracts compiler

## Installation

```sh
npm i
```

## Build

```sh
npm run build:proto # *.proto
npm run build # *.ts
```

## Server Start

```sh
node dist/server
# OR
npm start
```

## Client Test

```sh
# 1. Request
# 2. with Parameter
npm run client blahblahblah
# 3. Error
npm run client error
# 4. Stream
npm run client stream
# 5. Health Check
npm run health
```