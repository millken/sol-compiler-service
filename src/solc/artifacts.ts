import {
  Artifacts as IArtifacts,
  Artifact,
  CompilerInput,
  CompilerOutput,
  ArtifactName,
  ArtifactNameToString,
} from './types'
import fsExtra from "fs-extra"
import debug from 'debug'


const log = debug('solc:artifacts')
// log.enabled = true



export class Artifacts implements IArtifacts {
  private _compilerOutput: CompilerOutput;
  private _cache: Map<string, Artifact> = new Map();

  constructor(inputJSON: CompilerInput, outputJSON: CompilerOutput) {
    this._compilerOutput = outputJSON
    for (const [sourceName, contract] of Object.entries(
      outputJSON.contracts ?? {}
    )) {
      for (const [contractName, contractOutput] of Object.entries(contract ?? {})) {
        log("sourceName: " + sourceName + ", contractName: " + contractName)
        const artifact: Artifact = {
          _format: "hh-sol-artifact-1",
          contractName: contractName,
          sourceName: sourceName,
          abi: contractOutput?.abi,
          bytecode: contractOutput?.evm?.bytecode?.object || "",
          linkReferences: contractOutput?.evm?.bytecode?.linkReferences || {},
          deployedBytecode: contractOutput?.evm?.deployedBytecode?.object || "",
          deployedLinkReferences: contractOutput?.evm?.deployedBytecode?.linkReferences || {},
        }
        // if (contractName == "MetaSwap") {
        //   fsExtra.writeJSON('tmp.json', artifact, { spaces: 2 })
        // }
        const artifactName: ArtifactName = {
          sourceName: sourceName,
          contractName: contractName
        }
        this._cache.set(ArtifactNameToString(artifactName), artifact);
      }
    }
  }


  public readArtifact(artifactName: ArtifactName): Artifact {
    const artifact = this._cache.get(ArtifactNameToString(artifactName))
    if (artifact !== undefined) {
      return artifact
    }
    throw new Error("no matching artifact exists");
  }


  public artifactExists(artifactName: ArtifactName): boolean {
    return this._cache.has(ArtifactNameToString(artifactName))
  }

  public getAllFullyNames(): ArtifactName[] {
    const artifactNames: ArtifactName[] = []
    for (let key of this._cache.keys()) {
      const [sourceName, contractName] = key.split("\t", 2)
      const artifactName: ArtifactName = {
        sourceName: sourceName,
        contractName: contractName,
      }
      artifactNames.push(artifactName)
    }
    return artifactNames
  }

  public getCompilerOutput(): CompilerOutput {
    return this._compilerOutput
  }
}