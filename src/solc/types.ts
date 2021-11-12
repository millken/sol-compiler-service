export interface VerifyContract {
    bytecode:string;
  }


export interface CompilerWasm {
    version:string;
    solcPath: string;
    inputJSON?: string;
    outputJSON?: any;
  }


/**
 * An artifact representing the compilation output of a contract.
 *
 * This file has just enough information to deploy the contract and interact
 * with an already deployed instance of it.
 *
 * For debugging information and other extra information, you should look for
 * its companion DebugFile, which should be stored right next to it.
 *
 * Note that DebugFiles are only generated for Solidity contracts.
 */
export interface Artifact {
    _format: string;
    contractName: string;
    sourceName: string;
    abi: any[];
    bytecode: string; // "0x"-prefixed hex string
    deployedBytecode: string; // "0x"-prefixed hex string
    linkReferences: LinkReferences;
    deployedLinkReferences: LinkReferences;
  }
  
  /**
   * A DebugFile contains any extra information about a Solidity contract that
   * Hardhat and its plugins need.
   *
   * The current version of DebugFiles only contains a path to a BuildInfo file.
   */
  export interface DebugFile {
    _format: string;
    buildInfo: string;
  }
  
  /**
   * A BuildInfo is a file that contains all the information of a solc run. It
   * includes all the necessary information to recreate that exact same run, and
   * all of its output.
   */
  export interface BuildInfo {
    _format: string;
    id: string;
    solcVersion: string;
    solcLongVersion: string;
    input: CompilerInput;
    output: CompilerOutput;
  }
  
  export interface LinkReferences {
    [libraryFileName: string]: {
      [libraryName: string]: Array<{ length: number; start: number }>;
    };
  }
  
  export interface CompilerInput {
    language: string;
    sources: { [sourceName: string]: { content: string } };
    settings: {
      optimizer: { runs?: number; enabled?: boolean };
      metadata?: { useLiteralContent: boolean };
      outputSelection: {
        [sourceName: string]: {
          [contractName: string]: string[];
        };
      };
      evmVersion?: string;
      libraries?: {
        [libraryFileName: string]: {
          [libraryName: string]: string;
        };
      };
    };
  }
  
  export interface CompilerOutputContract {
    abi: any;
    evm: {
      bytecode: CompilerOutputBytecode;
      deployedBytecode: CompilerOutputBytecode;
      methodIdentifiers: {
        [methodSignature: string]: string;
      };
    };
  }
  
  export interface CompilerOutput {
    sources: CompilerOutputSources;
    contracts: {
      [sourceName: string]: {
        [contractName: string]: CompilerOutputContract;
      };
    };
  }
  
  export interface CompilerOutputSource {
    id: number;
    ast: any;
  }
  
  export interface CompilerOutputSources {
    [sourceName: string]: CompilerOutputSource;
  }
  
  export interface CompilerOutputBytecode {
    object: string;
    opcodes: string;
    sourceMap: string;
    linkReferences: {
      [sourceName: string]: {
        [libraryName: string]: Array<{ start: 0; length: 20 }>;
      };
    };
    immutableReferences?: {
      [key: string]: Array<{ start: number; length: number }>;
    };
  }
  