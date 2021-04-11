let grpc = require("grpc");
let protoLoader = require("@grpc/proto-loader");

let proto = grpc.loadPackageDefinition(
    protoLoader.loadSync("./proto/solc.proto",{
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
      })
);

  const REMOTE_SERVER = "0.0.0.0:2019";
let client = new proto.solc.CompilerService(REMOTE_SERVER, grpc.credentials.createInsecure());
client.solcCompiler({language: "Solidity"}, (err, res) =>{ console.log(res); } );
