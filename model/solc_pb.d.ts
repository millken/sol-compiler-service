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
    }
}

export class VerifierRequest extends jspb.Message { 
    getVersion(): string;
    setVersion(value: string): VerifierRequest;
    getBytecodefromchain(): string;
    setBytecodefromchain(value: string): VerifierRequest;
    getBytecodefromcompiler(): string;
    setBytecodefromcompiler(value: string): VerifierRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): VerifierRequest.AsObject;
    static toObject(includeInstance: boolean, msg: VerifierRequest): VerifierRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: VerifierRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): VerifierRequest;
    static deserializeBinaryFromReader(message: VerifierRequest, reader: jspb.BinaryReader): VerifierRequest;
}

export namespace VerifierRequest {
    export type AsObject = {
        version: string,
        bytecodefromchain: string,
        bytecodefromcompiler: string,
    }
}

export class VerifierResponse extends jspb.Message { 
    getVerified(): boolean;
    setVerified(value: boolean): VerifierResponse;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): VerifierResponse.AsObject;
    static toObject(includeInstance: boolean, msg: VerifierResponse): VerifierResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: VerifierResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): VerifierResponse;
    static deserializeBinaryFromReader(message: VerifierResponse, reader: jspb.BinaryReader): VerifierResponse;
}

export namespace VerifierResponse {
    export type AsObject = {
        verified: boolean,
    }
}
