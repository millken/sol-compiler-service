
import debug from 'debug'
const solc = require('solc')
const log = debug('solc:compiler')

export interface CompilerWasm {
    version:string;
    solcPath: string;
    inputJSON?: string;
    outputJSON?: string;
  }

export  function wasmCompile(wasm: CompilerWasm): void{
  console.time("WASM Compile time")
  const soljson = solc.setupMethods(require(wasm.solcPath))
  log('version: ', wasm.version)
  log('solcPATH: ', wasm.solcPath)
  log('inputJSON: ', wasm.inputJSON)
  wasm.outputJSON = soljson.compile(wasm.inputJSON);
  console.timeEnd("WASM Compile time")
}

export function getWasmCompiler (version:string): CompilerWasm {
  const soljsonPath = process.env.SOLJSON_PATH + '/soljson-v' + version + '.js'
  if (!wasmModuleIsAvailable(soljsonPath)) {
    log('wasm compiler cant be found: ' + version)
    throw new Error(
            `The compiler can not be loaded:
      ${version}
      
      You can download compiler to ${process.env.SOLJSON_PATH} and fix it.`
    )
  }
  const compilerWasm: CompilerWasm = {
    version: version,
    solcPath: soljsonPath,
  }
  return compilerWasm
}

export function wasmModuleIsAvailable (path:string): boolean {
  try {
    require.resolve(path)
    return true
  } catch {}
  return false
}
