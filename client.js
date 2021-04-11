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

  const REMOTE_SERVER = "0.0.0.0:2021";
let client = new proto.iotex.SolcService(REMOTE_SERVER, grpc.credentials.createInsecure());
let compilerInput = {
  version: "0.5.7+commit.6da8b019",
  language: "Solidity",
  //settings:{},
  sources: [
    {
      name: "hello.sol",
      content: `// SPDX-License-Identifier: MIT

      pragma solidity >=0.5.0 <0.9.0;
      
      contract HelloWorld {
          string defaultName;
          mapping(address => string) public accounts;
      
          constructor() public {
              defaultName = "World";
          }
      
          function getMessage() public view returns (string memory) {
              string memory name = bytes(accounts[msg.sender]).length > 0
                  ? accounts[msg.sender]
                  : defaultName;
              return concat("Hello", name);
          }
      
          function setName(string memory name) public returns (bool success) {
              require(bytes(name).length > 0);
              accounts[msg.sender] = name;
              return true;
          }
      
          function concat(string memory _base, string memory _value)
              internal
              pure
              returns (string memory)
          {
              bytes memory _baseBytes = bytes(_base);
              bytes memory _valueBytes = bytes(_value);
              string memory _tmpValue = new string(
                  _baseBytes.length + _valueBytes.length
              );
              bytes memory _newValue = bytes(_tmpValue);
              uint256 i;
              uint256 j;
              for (i = 0; i < _baseBytes.length; i++) {
                  _newValue[j++] = _baseBytes[i];
              }
              for (i = 0; i < _valueBytes.length; i++) {
                  _newValue[j++] = _valueBytes[i];
              }
              return string(_newValue);
          }
      }`
    },
  ],
}
//client.compiler(compilerInput, (err, res) =>{ console.log(res); } );

const input = {
  language: 'Solidity',
  sources: {
    "hello.sol": {
      content: `contract HelloWorld {
        bytes32 message;
        constructor(bytes32 myMessage) public {
            message = myMessage;
        }
    
        function getMessage() public view returns(bytes32){
            return message;
        }
    }`
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
}
compilerInput = {
  version: "0.6.9+commit.3e3065ac",
  inputJSON: JSON.stringify(input),
}
//client.compilerStandardJSON(compilerInput, (err, res) =>{ console.log(res); } );

let verifierInput = {
  version:"0.5.7+commit.6da8b019",
  bytecodeFromChain: "608060405234801561001057600080fd5b506040516020806100d58339810180604052602081101561003057600080fd5b81019080805190602001909291905050508060008190555050607e806100576000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063ce6d41de14602d575b600080fd5b60336049565b6040518082815260200191505060405180910390f35b6000805490509056fea165627a7a72305820c9e1c145de3e8bd7d31b255f563418df3f9b3ce10518cd5e7a64b798763ad0ea0029",
  bytecodeFromCompiler:"608060405234801561001057600080fd5b506040516020806100d58339810180604052602081101561003057600080fd5b81019080805190602001909291905050508060008190555050607e806100576000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063ce6d41de14602d575b600080fd5b60336049565b6040518082815260200191505060405180910390f35b6000805490509056fea165627a7a723058202c921b9b4845401d04ac2f285bd09fc51d7f6cb77d6f78de11fd52dbce0dcda90029"
}
client.verifier(verifierInput, (err, res) =>{ console.log(res); } );