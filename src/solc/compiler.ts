
import debug from 'debug'
const solc = require('solc')
const log = debug('solc:compiler')
import {CompilerWasm} from './types'


export  function wasmCompile(wasm: CompilerWasm): any{
  console.time("WASM Compile time")
  const soljson = solc.setupMethods(require(wasm.solcPath))
  log('version: ', wasm.version)
  log('solcPATH: ', wasm.solcPath)
  log('inputJSON: ', wasm.inputJSON)
  const output = soljson.compile(wasm.inputJSON);
  wasm.outputJSON = JSON.parse(output)
  console.timeEnd("WASM Compile time")
  return wasm.outputJSON
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
