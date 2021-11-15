import {
    Artifacts as IArtifacts,
    BuildInfo,
    CompilerInput,
    DebugFile,
  } from "hardhat/types";
  import {
    CompilerWasm,
     Artifact,
    CompilerOutput,
    ArtifactName,
  } from './types'
  import fsExtra from "fs-extra"
  import debug from 'debug'

  const log = debug('solc:artifacts')
  export class Artifacts  {
//     private _buildInfosGlob: string;
    private _cache: Map<ArtifactName, Artifact> = new Map();
  
    constructor(outputJSON: CompilerOutput) {
      for (const [sourceName, contract] of Object.entries(
        outputJSON.contracts ?? {}
      )) {
        for (const [contractName, contractOutput] of Object.entries(contract  ?? {})) {
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
          this._cache.set(artifactName, artifact);
        }
      }
    }

  
    public readArtifact(artifactName: ArtifactName): Artifact {
        const artifact = this._cache.get(artifactName)
        if ( artifact) {
          return artifact
        }
        throw new Error("no matching artifact exists");
    }
  
  
    public artifactExists(artifactName: ArtifactName): boolean {
      return this._cache.has(artifactName)
    }
  
    public getAllFullyNames(): ArtifactName[] {
      const artifactNames: ArtifactName[] = []
      for (let key of this._cache.keys()) {
        artifactNames.push(key)                
    }
    return artifactNames
    }
  
//     public async getBuildInfo(
//       fullyQualifiedName: string
//     ): Promise<BuildInfo | undefined> {
//       const artifactPath =
//         this._getArtifactPathFromFullyQualifiedName(fullyQualifiedName);
  
//       const debugFilePath = this._getDebugFilePath(artifactPath);
//       const buildInfoPath = await this._getBuildInfoFromDebugFile(debugFilePath);
  
//       if (buildInfoPath === undefined) {
//         return undefined;
//       }
  
//       return fsExtra.readJSON(buildInfoPath);
//     }
  
//     public async getArtifactPaths(): Promise<string[]> {
//       const paths = await glob(path.join(this._artifactsPath, "**/*.json"), {
//         ignore: [this._buildInfosGlob, this._dbgsGlob],
//       });
  
//       return paths.sort();
//     }
  
//     public async getBuildInfoPaths(): Promise<string[]> {
//       const paths = await glob(this._buildInfosGlob);
  
//       return paths.sort();
//     }
  
//     public async getDebugFilePaths(): Promise<string[]> {
//       const paths = await glob(this._dbgsGlob);
  
//       return paths.sort();
//     }
  
//     public async saveArtifactAndDebugFile(
//       artifact: Artifact,
//       pathToBuildInfo?: string
//     ) {
//       // artifact
//       const fullyQualifiedName = getFullyQualifiedName(
//         artifact.sourceName,
//         artifact.contractName
//       );
  
//       const artifactPath =
//         this._getArtifactPathFromFullyQualifiedName(fullyQualifiedName);
  
//       await fsExtra.ensureDir(path.dirname(artifactPath));
  
//       // write artifact
//       await fsExtra.writeJSON(artifactPath, artifact, {
//         spaces: 2,
//       });
  
//       if (pathToBuildInfo === undefined) {
//         return;
//       }
  
//       // save debug file
//       const debugFilePath = this._getDebugFilePath(artifactPath);
//       const debugFile = this._createDebugFile(artifactPath, pathToBuildInfo);
  
//       await fsExtra.writeJSON(debugFilePath, debugFile, {
//         spaces: 2,
//       });
//     }
  
//     public async saveBuildInfo(
//       solcVersion: string,
//       solcLongVersion: string,
//       input: CompilerInput,
//       output: CompilerOutput
//     ): Promise<string> {
//       const buildInfoDir = path.join(this._artifactsPath, BUILD_INFO_DIR_NAME);
//       await fsExtra.ensureDir(buildInfoDir);
  
//       const buildInfoName = this._getBuildInfoName(
//         solcVersion,
//         solcLongVersion,
//         input
//       );
  
//       const buildInfo = this._createBuildInfo(
//         buildInfoName,
//         solcVersion,
//         solcLongVersion,
//         input,
//         output
//       );
  
//       const buildInfoPath = path.join(buildInfoDir, `${buildInfoName}.json`);
//       await fsExtra.writeJson(buildInfoPath, buildInfo, { spaces: 2 });
  
//       return buildInfoPath;
//     }
  
//     /**
//      * Remove all artifacts that don't correspond to the current solidity files
//      */
//     public async removeObsoleteArtifacts(
//       artifactsEmittedPerFile: Array<{
//         sourceName: string;
//         artifacts: string[];
//       }>
//     ) {
//       const validArtifactsPaths = new Set<string>();
  
//       for (const { sourceName, artifacts } of artifactsEmittedPerFile) {
//         for (const artifactName of artifacts) {
//           validArtifactsPaths.add(
//             this._getArtifactPathSync(
//               getFullyQualifiedName(sourceName, artifactName)
//             )
//           );
//         }
//       }
  
//       const existingArtifactsPaths = await this.getArtifactPaths();
  
//       for (const artifactPath of existingArtifactsPaths) {
//         if (!validArtifactsPaths.has(artifactPath)) {
//           await this._removeArtifactFiles(artifactPath);
//         }
//       }
//     }
  
//     /**
//      * Remove all build infos that aren't used by any debug file
//      */
//     public async removeObsoleteBuildInfos() {
//       const debugFiles = await this.getDebugFilePaths();
  
//       const validBuildInfos = new Set<string>();
//       for (const debugFile of debugFiles) {
//         const buildInfoFile = await this._getBuildInfoFromDebugFile(debugFile);
//         if (buildInfoFile !== undefined) {
//           validBuildInfos.add(
//             path.resolve(path.dirname(debugFile), buildInfoFile)
//           );
//         }
//       }
  
//       const buildInfoFiles = await this.getBuildInfoPaths();
  
//       for (const buildInfoFile of buildInfoFiles) {
//         if (!validBuildInfos.has(buildInfoFile)) {
//           log(`Removing buildInfo '${buildInfoFile}'`);
//           await fsExtra.unlink(buildInfoFile);
//         }
//       }
//     }
  
//     private _getBuildInfoName(
//       solcVersion: string,
//       solcLongVersion: string,
//       input: CompilerInput
//     ): string {
//       const json = JSON.stringify({
//         _format: BUILD_INFO_FORMAT_VERSION,
//         solcVersion,
//         solcLongVersion,
//         input,
//       });
  
//       return createNonCryptographicHashBasedIdentifier(
//         Buffer.from(json)
//       ).toString("hex");
//     }
  
//     /**
//      * Returns the absolute path to the artifact that corresponds to the given
//      * name.
//      *
//      * If the name is fully qualified, the path is computed from it.  If not, an
//      * artifact that matches the given name is searched in the existing artifacts.
//      * If there is an ambiguity, an error is thrown.
//      */
//     private async _getArtifactPath(name: string): Promise<string> {
//       if (isFullyQualifiedName(name)) {
//         return this._getArtifactPathFromFullyQualifiedName(name);
//       }
  
//       const files = await this.getArtifactPaths();
//       return this._getArtifactPathFromFiles(name, files);
//     }
  
//     private _createBuildInfo(
//       id: string,
//       solcVersion: string,
//       solcLongVersion: string,
//       input: CompilerInput,
//       output: CompilerOutput
//     ): BuildInfo {
//       return {
//         id,
//         _format: BUILD_INFO_FORMAT_VERSION,
//         solcVersion,
//         solcLongVersion,
//         input,
//         output,
//       };
//     }
  
//     private _createDebugFile(artifactPath: string, pathToBuildInfo: string) {
//       const relativePathToBuildInfo = path.relative(
//         path.dirname(artifactPath),
//         pathToBuildInfo
//       );
  
//       const debugFile: DebugFile = {
//         _format: DEBUG_FILE_FORMAT_VERSION,
//         buildInfo: relativePathToBuildInfo,
//       };
  
//       return debugFile;
//     }
  
//     private _getArtifactPathsSync(): string[] {
//       return globSync(path.join(this._artifactsPath, "**/*.json"), {
//         ignore: [this._buildInfosGlob, this._dbgsGlob],
//       });
//     }
  
//     /**
//      * Sync version of _getArtifactPath
//      */
//     private _getArtifactPathSync(name: string): string {
//       if (isFullyQualifiedName(name)) {
//         return this._getArtifactPathFromFullyQualifiedName(name);
//       }
  
//       const files = this._getArtifactPathsSync();
//       return this._getArtifactPathFromFiles(name, files);
//     }
  
//     private _getArtifactPathFromFullyQualifiedName(
//       fullyQualifiedName: string
//     ): string {
//       const { sourceName, contractName } =
//         parseFullyQualifiedName(fullyQualifiedName);
  
//       return path.join(this._artifactsPath, sourceName, `${contractName}.json`);
//     }
  
//     private _getDebugFilePath(artifactPath: string): string {
//       return artifactPath.replace(/\.json$/, ".dbg.json");
//     }
  
//     private _getArtifactPathFromFiles(
//       contractName: string,
//       files: string[]
//     ): string {
//       const matchingFiles = files.filter((file) => {
//         return path.basename(file) === `${contractName}.json`;
//       });
  
//       if (matchingFiles.length === 0) {
//         throw new HardhatError(ERRORS.ARTIFACTS.NOT_FOUND, {
//           contractName,
//         });
//       }
  
//       if (matchingFiles.length > 1) {
//         const candidates = matchingFiles
//           .map((file) => this._getFullyQualifiedNameFromPath(file))
//           .map(path.normalize);
  
//         throw new HardhatError(ERRORS.ARTIFACTS.MULTIPLE_FOUND, {
//           contractName,
//           candidates: candidates.join(os.EOL),
//         });
//       }
  
//       return matchingFiles[0];
//     }
  
//     /**
//      * Returns the FQN of a contract giving the absolute path to its artifact.
//      *
//      * For example, given a path like
//      * `/path/to/project/artifacts/contracts/Foo.sol/Bar.json`, it'll return the
//      * FQN `contracts/Foo.sol:Bar`
//      */
//     private _getFullyQualifiedNameFromPath(absolutePath: string): string {
//       const sourceName = replaceBackslashes(
//         path.relative(this._artifactsPath, path.dirname(absolutePath))
//       );
  
//       const contractName = path.basename(absolutePath).replace(".json", "");
  
//       return getFullyQualifiedName(sourceName, contractName);
//     }
  
//     /**
//      * Remove the artifact file, its debug file and, if it exists, its build
//      * info file.
//      */
//     private async _removeArtifactFiles(artifactPath: string) {
//       await fsExtra.remove(artifactPath);
  
//       const debugFilePath = this._getDebugFilePath(artifactPath);
//       const buildInfoPath = await this._getBuildInfoFromDebugFile(debugFilePath);
  
//       await fsExtra.remove(debugFilePath);
  
//       if (buildInfoPath !== undefined) {
//         await fsExtra.remove(buildInfoPath);
//       }
//     }
  
//     /**
//      * Given the path to a debug file, returns the absolute path to its
//      * corresponding build info file if it exists, or undefined otherwise.
//      */
//     private async _getBuildInfoFromDebugFile(
//       debugFilePath: string
//     ): Promise<string | undefined> {
//       if (await fsExtra.pathExists(debugFilePath)) {
//         const { buildInfo } = await fsExtra.readJson(debugFilePath);
//         return path.resolve(path.dirname(debugFilePath), buildInfo);
//       }
  
//       return undefined;
//     }
  }