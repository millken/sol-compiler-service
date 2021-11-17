// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var solc_pb = require('./solc_pb.js');

function serialize_iotex_CompilerRequest(arg) {
  if (!(arg instanceof solc_pb.CompilerRequest)) {
    throw new Error('Expected argument of type iotex.CompilerRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_iotex_CompilerRequest(buffer_arg) {
  return solc_pb.CompilerRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_iotex_CompilerResponse(arg) {
  if (!(arg instanceof solc_pb.CompilerResponse)) {
    throw new Error('Expected argument of type iotex.CompilerResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_iotex_CompilerResponse(buffer_arg) {
  return solc_pb.CompilerResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var SolcService = exports.SolcService = {
  compilerStandardJSON: {
    path: '/iotex.Solc/compilerStandardJSON',
    requestStream: false,
    responseStream: false,
    requestType: solc_pb.CompilerRequest,
    responseType: solc_pb.CompilerResponse,
    requestSerialize: serialize_iotex_CompilerRequest,
    requestDeserialize: deserialize_iotex_CompilerRequest,
    responseSerialize: serialize_iotex_CompilerResponse,
    responseDeserialize: deserialize_iotex_CompilerResponse,
  },
  compiler: {
    path: '/iotex.Solc/compiler',
    requestStream: false,
    responseStream: false,
    requestType: solc_pb.CompilerRequest,
    responseType: solc_pb.CompilerResponse,
    requestSerialize: serialize_iotex_CompilerRequest,
    requestDeserialize: deserialize_iotex_CompilerRequest,
    responseSerialize: serialize_iotex_CompilerResponse,
    responseDeserialize: deserialize_iotex_CompilerResponse,
  },
};

exports.SolcClient = grpc.makeGenericClientConstructor(SolcService);
