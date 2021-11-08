import {
    sendUnaryData, ServerUnaryCall, 
    status, UntypedHandleCall
} from '@grpc/grpc-js';
import { randomBytes } from 'crypto';
import { Struct } from 'google-protobuf/google/protobuf/struct_pb';

import { SolcService, ISolcService, ISolcServer } from '../../model/solc_grpc_pb';
import { CompilerRequest, CompilerResponse, VerifierRequest, VerifierResponse } from '../../model/solc_pb';
import { logger, ServiceError } from '../util';

class Solc implements ISolcServer {
    [method: string]: UntypedHandleCall;

    public compiler(call: ServerUnaryCall<CompilerRequest, CompilerResponse>, callback: sendUnaryData<CompilerResponse>): void {
    }
    public compilerStandardJSON(call: ServerUnaryCall<CompilerRequest, CompilerResponse>, callback: sendUnaryData<CompilerResponse>): void {
    }
    public verifier(call: ServerUnaryCall<VerifierRequest, VerifierResponse>, callback: sendUnaryData<VerifierResponse>): void {
    }
}