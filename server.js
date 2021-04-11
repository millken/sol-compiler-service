let grpc = require("grpc");
let protoLoader = require("@grpc/proto-loader");
 
const server = new grpc.Server();
const URL = "0.0.0.0:2019";

let proto = grpc.loadPackageDefinition(
    protoLoader.loadSync("./proto/solc.proto",{
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
      })
);

function solcCompiler(call, callBack) {
       callBack(null, {content: `Hello ${call.request.language} welcome to the world`});
}

server.addService(proto.solc.CompilerService.service, { solcCompiler: solcCompiler });

server.bind(URL, grpc.ServerCredentials.createInsecure());
 
server.start();