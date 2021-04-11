#!/usr/bin/env node
let grpc = require("grpc");
let protoLoader = require("@grpc/proto-loader");
let solc = require('solc');
let log4js = require("log4js");
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
  server.addService(proto.solc.CompilerService.service, { solcCompiler: solcCompiler });
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

function solcCompiler(call, callBack) {
  console.debug("grpc request :", call.request)
  let version = call.request.version
  if (version == "") {
    console.error("missing version request");
    callBack(null, compilerResponse(formatFatalError("version required")));
    return;
  }
  let soljsonPath = program.opts().solcbin + "/soljson-v" + version + ".js";
  if (!moduleIsAvailable(soljsonPath)) {
    console.error("soljson file not exist: " + soljsonPath);
    callBack(null, compilerResponse(formatFatalError("module not found" + version)));
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
  console.debug("grpc response :", output)
  callBack(null, compilerResponse(output));
}