
import debug from 'debug'

export interface CompilerWasm {
    solcPath: string;
  }

const log = debug('solc:compiler')
export function getWasmCompiler (version:string): CompilerWasm {
  const soljsonPath = process.env.SOLJSON_PATH + '/soljson-v' + version + '.js'
  log(`Wasm compiler version : ${version}`)
  if (!wasmModuleIsAvailable(soljsonPath)) {
    log('Wasm compiler cant be found: ' + version)
    throw new Error(
            `The compiler can not be loaded:
      ${version}
      
      You can download compiler to ${process.env.SOLJSON_PATH} and fix it.`
    )
  }
  const compilerWasm: CompilerWasm = {
    solcPath: soljsonPath
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
