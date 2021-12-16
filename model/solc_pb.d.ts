// package: iotex
// file: solc.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class CompilerRequest extends jspb.Message { 
    getVersion(): string;
    setVersion(value: string): CompilerRequest;
    getLanguage(): string;
    setLanguage(value: string): CompilerRequest;
    clearSourcesList(): void;
    getSourcesList(): Array<CompilerSources>;
    setSourcesList(value: Array<CompilerSources>): CompilerRequest;
    addSources(value?: CompilerSources, index?: number): CompilerSources;

    hasSettings(): boolean;
    clearSettings(): void;
    getSettings(): CompilerSettings | undefined;
    setSettings(value?: CompilerSettings): CompilerRequest;
    getInputjson(): string;
    setInputjson(value: string): CompilerRequest;

    hasVerify(): boolean;
    clearVerify(): void;
    getVerify(): Verify | undefined;
    setVerify(value?: Verify): CompilerRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CompilerRequest.AsObject;
    static toObject(includeInstance: boolean, msg: CompilerRequest): CompilerRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CompilerRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CompilerRequest;
    static deserializeBinaryFromReader(message: CompilerRequest, reader: jspb.BinaryReader): CompilerRequest;
}

export namespace CompilerRequest {
    export type AsObject = {
        version: string,
        language: string,
        sourcesList: Array<CompilerSources.AsObject>,
        settings?: CompilerSettings.AsObject,
        inputjson: string,
        verify?: Verify.AsObject,
    }
}

export class CompilerSettings extends jspb.Message { 

    hasOptimizer(): boolean;
    clearOptimizer(): void;
    getOptimizer(): CompilerOptimizer | undefined;
    setOptimizer(value?: CompilerOptimizer): CompilerSettings;
    getEvmversion(): string;
    setEvmversion(value: string): CompilerSettings;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CompilerSettings.AsObject;
    static toObject(includeInstance: boolean, msg: CompilerSettings): CompilerSettings.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CompilerSettings, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CompilerSettings;
    static deserializeBinaryFromReader(message: CompilerSettings, reader: jspb.BinaryReader): CompilerSettings;
}

export namespace CompilerSettings {
    export type AsObject = {
        optimizer?: CompilerOptimizer.AsObject,
        evmversion: string,
    }
}

export class CompilerOptimizer extends jspb.Message { 
    getEnabled(): boolean;
    setEnabled(value: boolean): CompilerOptimizer;
    getRuns(): number;
    setRuns(value: number): CompilerOptimizer;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CompilerOptimizer.AsObject;
    static toObject(includeInstance: boolean, msg: CompilerOptimizer): CompilerOptimizer.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CompilerOptimizer, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CompilerOptimizer;
    static deserializeBinaryFromReader(message: CompilerOptimizer, reader: jspb.BinaryReader): CompilerOptimizer;
}

export namespace CompilerOptimizer {
    export type AsObject = {
        enabled: boolean,
        runs: number,
    }
}

export class CompilerSources extends jspb.Message { 
    getName(): string;
    setName(value: string): CompilerSources;
    getContent(): string;
    setContent(value: string): CompilerSources;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CompilerSources.AsObject;
    static toObject(includeInstance: boolean, msg: CompilerSources): CompilerSources.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CompilerSources, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CompilerSources;
    static deserializeBinaryFromReader(message: CompilerSources, reader: jspb.BinaryReader): CompilerSources;
}

export namespace CompilerSources {
    export type AsObject = {
        name: string,
        content: string,
    }
}

export class CompilerResponse extends jspb.Message { 
    getContent(): string;
    setContent(value: string): CompilerResponse;
    clearVerifiedList(): void;
    getVerifiedList(): Array<VerifyResponse>;
    setVerifiedList(value: Array<VerifyResponse>): CompilerResponse;
    addVerified(value?: VerifyResponse, index?: number): VerifyResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CompilerResponse.AsObject;
    static toObject(includeInstance: boolean, msg: CompilerResponse): CompilerResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CompilerResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CompilerResponse;
    static deserializeBinaryFromReader(message: CompilerResponse, reader: jspb.BinaryReader): CompilerResponse;
}

export namespace CompilerResponse {
    export type AsObject = {
        content: string,
        verifiedList: Array<VerifyResponse.AsObject>,
    }
}

export class Verify extends jspb.Message { 
    getVersion(): string;
    setVersion(value: string): Verify;
    getBytecode(): string;
    setBytecode(value: string): Verify;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Verify.AsObject;
    static toObject(includeInstance: boolean, msg: Verify): Verify.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Verify, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Verify;
    static deserializeBinaryFromReader(message: Verify, reader: jspb.BinaryReader): Verify;
}

export namespace Verify {
    export type AsObject = {
        version: string,
        bytecode: string,
    }
}

export class VerifyResponse extends jspb.Message { 
    getSourcename(): string;
    setSourcename(value: string): VerifyResponse;
    getContractname(): string;
    setContractname(value: string): VerifyResponse;
    getNormalizedbytecode(): string;
    setNormalizedbytecode(value: string): VerifyResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): VerifyResponse.AsObject;
    static toObject(includeInstance: boolean, msg: VerifyResponse): VerifyResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: VerifyResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): VerifyResponse;
    static deserializeBinaryFromReader(message: VerifyResponse, reader: jspb.BinaryReader): VerifyResponse;
}

export namespace VerifyResponse {
    export type AsObject = {
        sourcename: string,
        contractname: string,
        normalizedbytecode: string,
    }
}
