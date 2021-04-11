#!/usr/bin/env node
let grpc = require("grpc");
let protoLoader = require("@grpc/proto-loader");
let solc = require('solc');
let log4js = require("log4js");
let compareVersions = require('compare-versions');
const program = require('commander');

program
  .version('0.1.0')
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

function verifier(call, callBack) {
  console.debug("verifier grpc request :", call.request)
  let version = call.request.version || '';
  let verMatch = version.match(/\d+?\.\d+?\.\d+?/gi);
  if(version == "" || verMatch.length == 0) {
    console.error("verifier compiler version error: %s", version)
    callBack(null, {verified: false});
    return;
  }
  let ver = verMatch[0] || '0.0.0';
  let bytecodeFromChain = call.request.bytecodeFromChain|| '';
  let bytecodeFromCompiler = call.request.bytecodeFromCompiler|| '';
  let bytecodeFromChainStartingPoint, bytecodeFromChainEndingPoint;
  let bytecodeFromCompilerStartingPoint, bytecodeFromCompilerEndingPoint;

  if (compareVersions(ver, "0.4.7") >= 0){
    if (compareVersions(ver, "0.4.22") >= 0) {
			// if solc version is at least 0.4.22, initial bytecode has 6080... instead of 6060...
			bytecodeFromChainStartingPoint = bytecodeFromChain.lastIndexOf('6080604052');
			bytecodeFromCompilerStartingPoint = bytecodeFromCompiler.lastIndexOf('6080604052');
			// a165627a7a72305820 is a fixed prefix of swarm info that was appended to contract bytecode
			// the beginning of swarm_info is always the ending point of the actual contract bytecode

		} else {
			// if solc version is at least 0.4.7, then swarm hash is included into the bytecode.
			// every bytecode starts with a fixed opcode: "PUSH1 0x60 PUSH1 0x40 MSTORE"
			// which is 6060604052 in bytecode whose length is 10
			// var fixed_prefix= bytecode.slice(0,10);

			// every bytecode from compiler may or may not have constructor bytecode inserted before
			// actual deployed code (since constructor is optional).So there might be multiple matching
			// prefix of "6060604052", and actual deployed code starts at the last such pattern.
			bytecodeFromChainStartingPoint = bytecodeFromChain.lastIndexOf('6060604052');
			bytecodeFromCompilerStartingPoint = bytecodeFromCompiler.lastIndexOf('6060604052');
			// a165627a7a72305820 is a fixed prefix of swarm info that was appended to contract bytecode
			// the beginning of swarm_info is always the ending point of the actual contract bytecode
		}
    bytecodeFromChainEndingPoint = bytecodeFromChain.search('a165627a7a72305820');
    bytecodeFromCompilerEndingPoint = bytecodeFromCompiler.search('a165627a7a72305820');
    bytecodeFromChain = bytecodeFromChain.slice(bytecodeFromChainStartingPoint, bytecodeFromChainEndingPoint);
    bytecodeFromCompiler = bytecodeFromCompiler.slice(bytecodeFromChainStartingPoint, bytecodeFromChainEndingPoint);
  }
  callBack(null, {verified: bytecodeFromChain == bytecodeFromCompiler});
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
          '*': ["abi", "metadata", "evm.bytecode", "evm.methodIdentifiers", "evm.gasEstimates"]
        }
      }
    }
  };
  let optimizer = call.request.optimizer || { enabled: false, runs: 200 }
  input.settings.optimizer.enabled = optimizer.enabled || false;
  input.settings.optimizer.runs = optimizer.runs || 200;
  let sources = call.request.sources || [];
  for (var k in sources) {
    input.sources[sources[k].name || ""] = { content: sources[k].content || "" };
  }

  let output = soljson.compile(JSON.stringify(input));
  console.debug("compiler grpc response :", output)
  callBack(null, compilerResponse(output));
}