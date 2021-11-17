// package: iotex
// file: solc.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as solc_pb from "./solc_pb";

interface ISolcService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    compilerStandardJSON: ISolcService_IcompilerStandardJSON;
    compiler: ISolcService_Icompiler;
}

interface ISolcService_IcompilerStandardJSON extends grpc.MethodDefinition<solc_pb.CompilerRequest, solc_pb.CompilerResponse> {
    path: "/iotex.Solc/compilerStandardJSON";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<solc_pb.CompilerRequest>;
    requestDeserialize: grpc.deserialize<solc_pb.CompilerRequest>;
    responseSerialize: grpc.serialize<solc_pb.CompilerResponse>;
    responseDeserialize: grpc.deserialize<solc_pb.CompilerResponse>;
}
interface ISolcService_Icompiler extends grpc.MethodDefinition<solc_pb.CompilerRequest, solc_pb.CompilerResponse> {
    path: "/iotex.Solc/compiler";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<solc_pb.CompilerRequest>;
    requestDeserialize: grpc.deserialize<solc_pb.CompilerRequest>;
    responseSerialize: grpc.serialize<solc_pb.CompilerResponse>;
    responseDeserialize: grpc.deserialize<solc_pb.CompilerResponse>;
}

export const SolcService: ISolcService;

export interface ISolcServer extends grpc.UntypedServiceImplementation {
    compilerStandardJSON: grpc.handleUnaryCall<solc_pb.CompilerRequest, solc_pb.CompilerResponse>;
    compiler: grpc.handleUnaryCall<solc_pb.CompilerRequest, solc_pb.CompilerResponse>;
}

export interface ISolcClient {
    compilerStandardJSON(request: solc_pb.CompilerRequest, callback: (error: grpc.ServiceError | null, response: solc_pb.CompilerResponse) => void): grpc.ClientUnaryCall;
    compilerStandardJSON(request: solc_pb.CompilerRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: solc_pb.CompilerResponse) => void): grpc.ClientUnaryCall;
    compilerStandardJSON(request: solc_pb.CompilerRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: solc_pb.CompilerResponse) => void): grpc.ClientUnaryCall;
    compiler(request: solc_pb.CompilerRequest, callback: (error: grpc.ServiceError | null, response: solc_pb.CompilerResponse) => void): grpc.ClientUnaryCall;
    compiler(request: solc_pb.CompilerRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: solc_pb.CompilerResponse) => void): grpc.ClientUnaryCall;
    compiler(request: solc_pb.CompilerRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: solc_pb.CompilerResponse) => void): grpc.ClientUnaryCall;
}

export class SolcClient extends grpc.Client implements ISolcClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public compilerStandardJSON(request: solc_pb.CompilerRequest, callback: (error: grpc.ServiceError | null, response: solc_pb.CompilerResponse) => void): grpc.ClientUnaryCall;
    public compilerStandardJSON(request: solc_pb.CompilerRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: solc_pb.CompilerResponse) => void): grpc.ClientUnaryCall;
    public compilerStandardJSON(request: solc_pb.CompilerRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: solc_pb.CompilerResponse) => void): grpc.ClientUnaryCall;
    public compiler(request: solc_pb.CompilerRequest, callback: (error: grpc.ServiceError | null, response: solc_pb.CompilerResponse) => void): grpc.ClientUnaryCall;
    public compiler(request: solc_pb.CompilerRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: solc_pb.CompilerResponse) => void): grpc.ClientUnaryCall;
    public compiler(request: solc_pb.CompilerRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: solc_pb.CompilerResponse) => void): grpc.ClientUnaryCall;
}
