# sol-compiler-service [![Build and Publish Docker Image](https://github.com/millken/sol-compiler-service/actions/workflows/publish-docker-image.yml/badge.svg)](https://github.com/millken/sol-compiler-service/actions/workflows/publish-docker-image.yml)

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

docker run
```
docker run --name solc  -v /path/to/solcbin/:/app/solc-bin:ro -e PORT=50051 -e DEBUG=true -e SOLJSON_PATH=/app/solc-bin --publish 50051:50051 millken/sol-compiler-service
```

## Server Start

```sh
node dist/server
# OR
npm start
```

## Link

https://searchcode.com/file/309900902/docs/metadata.rst/