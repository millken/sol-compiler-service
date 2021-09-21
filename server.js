#!/usr/bin/env node
let grpc = require("grpc");
let protoLoader = require("@grpc/proto-loader");
let solc = require('solc');
let log4js = require("log4js");
let compareVersions = require('compare-versions');
const program = require('commander');

program
  .version('1.1.0')
  .option('-d, --debug', 'debug level', false)
  .option('-l, --listen <address>', 'grpc server listen address', '0.0.0.0:2021')
  .option('-b, --solcbin <folder>', 'directory with solc json bin files', process.cwd() + '/solc-bin/')
  .action(runServer);
program.parse();

let debug = program.opts().debug ? true : false;

const logger = log4js.getLogger('sol-compiler-service', 'console');
logger.level = debug ? "debug" : "info";
console.debug = logger.debug.bind(logger);
console.log = logger.info.bind(logger);
console.warn = logger.warn.bind(logger);
console.error = logger.error.bind(logger);
console.trace = logger.trace.bind(logger);

function runServer() {

  let proto = grpc.loadPackageDefinition(
    protoLoader.loadSync("./proto/solc.proto", {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    })
  );

  let server = new grpc.Server();
  server.addService(proto.iotex.SolcService.service, {
    compilerStandardJSON: compilerStandardJSON,
    compiler: compiler,
    verifier: verifier,
  });
  server.bind(program.opts().listen, grpc.ServerCredentials.createInsecure());
  console.log("starting grpc server on: " + program.opts().listen);
  server.start();
}

function formatFatalError(message) {
  return JSON.stringify({
    errors: [
      {
        'type': 'JSONError',
        'component': 'solcjs',
        'severity': 'error',
        'message': message,
        'formattedMessage': 'Error: ' + message
      }
    ]
  });
}

function moduleIsAvailable(path) {
  try {
    require.resolve(path);
    return true;
  } catch (e) {
    return false;
  }
}

function compilerResponse(content) {
  return { content: content }
}

function getCompilerFile(version) {
  if (version == "") {
    console.error("missing version request");
    return "";
  }
  let soljsonPath = program.opts().solcbin + "/soljson-v" + version + ".js";
  if (!moduleIsAvailable(soljsonPath)) {
    console.error("compiler can not loaded: " + version + ", soljson file not exist: " + soljsonPath);
    return "";
  }
  return soljsonPath;
}

function compilerStandardJSON(call, callBack) {
  console.debug("compilerStandardJSON grpc request :", call.request)
  let version = call.request.version || '';
  let compilerFile = getCompilerFile(version);
  if (compilerFile == "") {
    callBack(null, compilerResponse(formatFatalError("compiler can not loaded: " + version)));
    return
  }
  let soljson = solc.setupMethods(require(compilerFile));

  let inputJSON = call.request.inputJSON || '{}';
  let output = soljson.compile(inputJSON);
  console.debug("compilerStandardJSON grpc response :", output)
  callBack(null, compilerResponse(output));
}

//https://github.com/blockscout/blockscout/blob/master/apps/explorer/lib/explorer/smart_contract/verifier.ex
function verifier(call, callBack) {
  console.debug("verifier grpc request :", call.request)
  let version = call.request.version || '';
  let verMatch = version.match(/\d+?\.\d+?\.\d+/gi);
  if (version == "" || verMatch.length == 0) {
    console.error("verifier compiler version error: %s", version)
    callBack(null, { verified: false });
    return;
  }
  let ver = verMatch[0] || '0.0.0';
  let bytecodeFromChain = call.request.bytecodeFromChain || '';
  let bytecodeFromCompiler = call.request.bytecodeFromCompiler || '';
  let bytecodeFromChainStartingPoint, bytecodeFromChainEndingPoint;
  let bytecodeFromCompilerStartingPoint, bytecodeFromCompilerEndingPoint;
  let startIdx = '-B-';
  let endIdx = '-E-';

  bytecodeFromChain = getBytecodeWithoutMetadata(bytecodeFromChain)
  bytecodeFromCompiler = getBytecodeWithoutMetadata(bytecodeFromCompiler)

  if (compareVersions(ver, "0.6.0") >= 0) {
    startIdx = '6080604052';
    endIdx = 'a264697066735822';
  } else if (compareVersions(ver, "0.5.11") >= 0) {
    startIdx = '6080604052';
    endIdx = 'a265627a7a72315820';
  } else if (compareVersions(ver, "0.5.10") >= 0) {
    startIdx = '6080604052';
    endIdx = 'a265627a7a72305820';
  } else if (compareVersions(ver, "0.4.22") >= 0) {
    startIdx = '6080604052';
    endIdx = 'a165627a7a72305820';
  } else if (compareVersions(ver, "0.4.7") >= 0) {
    startIdx = '6060604052';
    endIdx = 'a165627a7a72305820';
  }
  console.debug("ver: " + ver + " startIdx: " + startIdx + " endIdx: "+ endIdx)
  bytecodeFromChainStartingPoint = bytecodeFromChain.search(startIdx);
  bytecodeFromCompilerStartingPoint = bytecodeFromCompiler.search(startIdx);
  bytecodeFromChainEndingPoint = bytecodeFromChain.search(endIdx);
  bytecodeFromCompilerEndingPoint = bytecodeFromCompiler.search(endIdx);
  bytecodeFromChain = bytecodeFromChain.slice(bytecodeFromChainStartingPoint, bytecodeFromChainEndingPoint);
  bytecodeFromCompiler = bytecodeFromCompiler.slice(bytecodeFromCompilerStartingPoint, bytecodeFromCompilerEndingPoint);
  callBack(null, { verified: bytecodeFromChain == bytecodeFromCompiler });
}

function getBytecodeWithoutMetadata(bytecode) {
  // Last 4 chars of bytecode specify byte size of metadata component,
  const metadataSize = parseInt(bytecode.slice(-4), 16) * 2 + 4;
  return bytecode.slice(0, bytecode.length - metadataSize);
}

function compiler(call, callBack) {
  console.debug("compiler grpc request :", call.request)
  let version = call.request.version
  if (version == "") {
    console.error("missing version request");
    callBack(null, compilerResponse(formatFatalError("version required")));
    return;
  }
  let soljsonPath = program.opts().solcbin + "/soljson-v" + version + ".js";
  if (!moduleIsAvailable(soljsonPath)) {
    console.error("compiler can not loaded: " + version + ", soljson file not exist: " + soljsonPath);
    callBack(null, compilerResponse(formatFatalError("compiler can not loaded: " + version)));
    return;
  }
  let soljson = solc.setupMethods(require(soljsonPath));
  let language = call.request.language || "Solidity";
  let input = {
    language: language,
    sources: {},
    settings: {
      optimizer: {
        enabled: false,
        runs: 200,
      },
      outputSelection: {
        '*': {
          '*': ["abi", "metadata", "evm.bytecode", "evm.deployedBytecode", "evm.methodIdentifiers", "evm.gasEstimates"]
        }
      }
    }
  };
  let optimizer = call.request.settings.optimizer || { enabled: false, runs: 200 }
  input.settings.optimizer.enabled = optimizer.enabled || false;
  input.settings.optimizer.runs = optimizer.runs || 200;
  let sources = call.request.sources || [];
  for (var k in sources) {
    input.sources[sources[k].name || ""] = { content: sources[k].content || "" };
  }
  console.debug("compiler grpc JSON.stringify(input) :", JSON.stringify(input))

  let output = soljson.compile(JSON.stringify(input));
  console.debug("compiler grpc response :", output)
  callBack(null, compilerResponse(output));
}