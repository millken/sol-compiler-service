var express = require("express");
var solc = require('solc');
var app = express();
app.get("/demo", (req, res, next) => {
    var solcx = solc.setupMethods(require("/media/millken/work/Github/solc-go/bin/soljson-v0.5.7+commit.6da8b019.js"))
    var input = {
        language: 'Solidity',
        sources: {
          'test.sol': {
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
          }
        },
        settings: {
          outputSelection: {
            '*': {
              '*': ["abi", "metadata", "evm.bytecode", "evm.methodIdentifiers", "evm.gasEstimates"]
            }
          }
        }
      };
      var output = JSON.parse(solcx.compile(JSON.stringify(input)));
 res.json(output);
});

app.get("/url", (req, res, next) => {
 res.json(["Tony","Lisa","Michael","Ginger","Food"]);
});

app.listen(3000, () => {
 console.log("Server running on port 3000");
});