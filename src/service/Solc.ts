import {
    sendUnaryData, ServerUnaryCall,
    status, UntypedHandleCall, ServerErrorResponse
} from '@grpc/grpc-js'
import fsExtra from "fs-extra";

import { SolcService, ISolcService, ISolcServer } from '../../model/solc_grpc_pb'
import {
    CompilerRequest,
    CompilerResponse,
    VerifierRequest,
    VerifierResponse,
    CompilerOptimizer,
    CompilerSettings
} from '../../model/solc_pb'
import { ServiceError,hasCompilationErrors } from '../util'
import { getWasmCompiler, wasmCompile } from '../solc/compiler'
import {VerifyContract, CompilerWasm} from '../solc/types'
import debug from 'debug'
import { Artifacts } from '../solc/artifacts';

const log = debug('service:solc')
class Solc implements ISolcServer {
    [method: string]: UntypedHandleCall;

    public compiler(call: ServerUnaryCall<CompilerRequest, CompilerResponse>, callback: sendUnaryData<CompilerResponse>): void {
        log("request compiler")

        const version = call.request.getVersion()
        if (version === '') {
            // https://grpc.io/grpc/node/grpc.html#.status__anchor
            return callback(new ServiceError(status.INVALID_ARGUMENT, 'InvalidVersion'), null)
        }

        let wasmCompiler: CompilerWasm = {
            version: version,
            solcPath: ''
        }
        try {
            wasmCompiler = getWasmCompiler(version)
        } catch (e) {
            return callback(e as Error, null)
        }

        const language = call.request.getLanguage() || 'Solidity'
        const input: any = {
            language: language,
            sources: {},
            settings: {
                optimizer: {
                    enabled: false,
                    runs: 200
                },
                // evmVersion: '',
                outputSelection: {
                    '*': {
                        '*': ['abi', 'metadata', 'evm.bytecode', 'evm.deployedBytecode', 'evm.methodIdentifiers', 'evm.gasEstimates']
                    }
                }
            }
        }
        const optimizer = { enabled: false, runs: 200 }
        const settings = call.request.getSettings()
        if (settings === undefined) {
            return callback(new ServiceError(status.INVALID_ARGUMENT, 'InvalidSettings'), null)
        }
        const optimizers = settings.getOptimizer()
        if (optimizers) {
            input.settings.optimizer = {
                enabled: optimizers.getEnabled(),
                runs: optimizers.getRuns()
            }
        }

        const evmVersion = settings.getEvmversion()
        if (evmVersion !== "") {
            input.settings.evmVersion = settings.getEvmversion()
        }

        const sources = call.request.getSourcesList()
        if (sources === undefined || sources.length == 0) {
            return callback(new ServiceError(status.INVALID_ARGUMENT, 'InvalidSources'), null)
        }
        for (const k in sources) {
            input.sources[sources[k].getName() || ''] = { content: sources[k].getContent() || '' }
        }
        wasmCompiler.inputJSON = JSON.stringify(input)
        
        const compilerRes = new CompilerResponse()

        wasmCompile(wasmCompiler)

        if (wasmCompiler.outputJSON) {
            compilerRes.setContent(wasmCompiler.outputJSON)
        }
        console.log(compilerRes.getContent())

        const verify = call.request.getVerify()
        if(verify) {
            const verifyContract:VerifyContract = {
                bytecode: verify.getBytecode()
            }
            log(verify.getVersion())
        }
        callback(null, compilerRes);
    }

    public compilerStandardJSON(call: ServerUnaryCall<CompilerRequest, CompilerResponse>, callback: sendUnaryData<CompilerResponse>): void {
        log("request compilerStandardJSON")
        const version = call.request.getVersion()
        if (version === '') {
            return callback(new ServiceError(status.INVALID_ARGUMENT, 'InvalidVersion'), null)
        }
        let wasmCompiler: CompilerWasm = {
            version: version,
            solcPath: ''
        }
        try {
            wasmCompiler = getWasmCompiler(version)
        } catch (e) {
            return callback(e as Error, null)
        }

        const inputJSON = call.request.getInputjson()
        if (version === '') {
            return callback(new ServiceError(status.INVALID_ARGUMENT, 'InvalidInputJSON'), null)
        }
        wasmCompiler.inputJSON = inputJSON
        const compilerRes = new CompilerResponse()

        wasmCompile(wasmCompiler)

        if (wasmCompiler.outputJSON !== undefined) {
            fsExtra.writeJson("output.json", wasmCompiler.outputJSON, { spaces: 2 });
            compilerRes.setContent(wasmCompiler.outputJSON)
        }

        const verify = call.request.getVerify()
        if(verify !== undefined) {
            const verifyContract:VerifyContract = {
                bytecode: verify.getBytecode()
            }
            //fsExtra.writeFile("input.txt", inputJSON);
            //fsExtra.writeJSONSync("input.json", JSON.parse(call.request.getInputjson()));
            new Artifacts(wasmCompiler.outputJSON)
            log(verify.getVersion())
        }

        callback(null, compilerRes);
    }

    public verifier(call: ServerUnaryCall<VerifierRequest, VerifierResponse>, callback: sendUnaryData<VerifierResponse>): void {
    }
}

export {
    Solc,
    SolcService
}
