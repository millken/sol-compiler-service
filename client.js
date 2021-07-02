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

const source1 = `// SPDX-License-Identifier: MIT
// File contracts/swap/interfaces/IMimoPair.sol

pragma solidity >=0.5.0;

interface IMimoPair {
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
    event Transfer(address indexed from, address indexed to, uint256 value);

    function name() external pure returns (string memory);

    function symbol() external pure returns (string memory);

    function decimals() external pure returns (uint8);

    function totalSupply() external view returns (uint256);

    function balanceOf(address owner) external view returns (uint256);

    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    function approve(address spender, uint256 value) external returns (bool);

    function transfer(address to, uint256 value) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool);

    event Mint(address indexed sender, uint256 amount0, uint256 amount1);
    event Burn(
        address indexed sender,
        uint256 amount0,
        uint256 amount1,
        address indexed to
    );
    event Swap(
        address indexed sender,
        uint256 amount0In,
        uint256 amount1In,
        uint256 amount0Out,
        uint256 amount1Out,
        address indexed to
    );
    event Sync(uint112 reserve0, uint112 reserve1);

    function MINIMUM_LIQUIDITY() external pure returns (uint256);

    function factory() external view returns (address);

    function token0() external view returns (address);

    function token1() external view returns (address);

    function getReserves()
        external
        view
        returns (
            uint112 reserve0,
            uint112 reserve1,
            uint32 blockTimestampLast
        );

    function price0CumulativeLast() external view returns (uint256);

    function price1CumulativeLast() external view returns (uint256);

    function kLast() external view returns (uint256);

    function mint(address to) external returns (uint256 liquidity);

    function burn(address to)
        external
        returns (uint256 amount0, uint256 amount1);

    function swap(
        uint256 amount0Out,
        uint256 amount1Out,
        address to,
        bytes calldata data
    ) external;

    function skim(address to) external;

    function sync() external;

    function initialize(address, address) external;
}


// File contracts/swap/interfaces/IMimoFactory.sol

pragma solidity >=0.5.0;

interface IMimoFactory {
    event PairCreated(
        address indexed token0,
        address indexed token1,
        address pair,
        uint256
    );

    function referral() external view returns (address);

    function feeTo() external view returns (address);

    function feeToSetter() external view returns (address);

    function getPair(address tokenA, address tokenB)
        external
        view
        returns (address pair);

    function allPairs(uint256) external view returns (address pair);

    function allPairsLength() external view returns (uint256);

    function createPair(address tokenA, address tokenB)
        external
        returns (address pair);

    function setFeeTo(address) external;

    function setFeeToSetter(address) external;

    function setReferral(address) external;
}


// File contracts/swap/interfaces/IMimoERC20.sol

pragma solidity >=0.5.0;

interface IMimoERC20 {
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
    event Transfer(address indexed from, address indexed to, uint256 value);

    function name() external pure returns (string memory);

    function symbol() external pure returns (string memory);

    function decimals() external pure returns (uint8);

    function totalSupply() external view returns (uint256);

    function balanceOf(address owner) external view returns (uint256);

    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    function approve(address spender, uint256 value) external returns (bool);

    function transfer(address to, uint256 value) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool);
}


// File contracts/swap/libraries/SafeMath.sol

pragma solidity =0.6.12;

// a library for performing overflow-safe math, courtesy of DappHub (https://github.com/dapphub/ds-math)

library SafeMath {
    function add(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require((z = x + y) >= x, "ds-math-add-overflow");
    }

    function sub(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require((z = x - y) <= x, "ds-math-sub-underflow");
    }

    function mul(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "division by zero");
        uint256 c = a / b;
        return c;
    }
}


// File contracts/swap/MimoERC20.sol

pragma solidity =0.6.12;


contract MimoERC20 is IMimoERC20 {
    using SafeMath for uint256;

    string public constant override name = "MIMO LPs";
    string public constant override symbol = "MIMO-LP";
    uint8 public constant override decimals = 18;
    uint256 public override totalSupply;
    mapping(address => uint256) public override balanceOf;
    mapping(address => mapping(address => uint256)) public override allowance;

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
    event Transfer(address indexed from, address indexed to, uint256 value);

    function _mint(address to, uint256 value) internal {
        totalSupply = totalSupply.add(value);
        balanceOf[to] = balanceOf[to].add(value);
        emit Transfer(address(0), to, value);
    }

    function _burn(address from, uint256 value) internal {
        balanceOf[from] = balanceOf[from].sub(value);
        totalSupply = totalSupply.sub(value);
        emit Transfer(from, address(0), value);
    }

    function _approve(
        address owner,
        address spender,
        uint256 value
    ) private {
        allowance[owner][spender] = value;
        emit Approval(owner, spender, value);
    }

    function _transfer(
        address from,
        address to,
        uint256 value
    ) private {
        balanceOf[from] = balanceOf[from].sub(value);
        balanceOf[to] = balanceOf[to].add(value);
        emit Transfer(from, to, value);
    }

    function approve(address spender, uint256 value)
        external
        override
        returns (bool)
    {
        _approve(msg.sender, spender, value);
        return true;
    }

    function transfer(address to, uint256 value)
        external
        override
        returns (bool)
    {
        _transfer(msg.sender, to, value);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external override returns (bool) {
        if (allowance[from][msg.sender] != uint256(-1)) {
            allowance[from][msg.sender] = allowance[from][msg.sender].sub(
                value
            );
        }
        _transfer(from, to, value);
        return true;
    }
}


// File contracts/swap/libraries/Math.sol

pragma solidity =0.6.12;

// a library for performing various math operations

library Math {
    function min(uint256 x, uint256 y) internal pure returns (uint256 z) {
        z = x < y ? x : y;
    }

    // babylonian method (https://en.wikipedia.org/wiki/Methods_of_computing_square_roots#Babylonian_method)
    function sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }
}


// File contracts/swap/libraries/UQ112x112.sol

pragma solidity =0.6.12;

// a library for handling binary fixed point numbers (https://en.wikipedia.org/wiki/Q_(number_format))

// range: [0, 2**112 - 1]
// resolution: 1 / 2**112

library UQ112x112 {
    uint224 constant Q112 = 2**112;

    // encode a uint112 as a UQ112x112
    function encode(uint112 y) internal pure returns (uint224 z) {
        z = uint224(y) * Q112; // never overflows
    }

    // divide a UQ112x112 by a uint112, returning a UQ112x112
    function uqdiv(uint224 x, uint112 y) internal pure returns (uint224 z) {
        z = x / uint224(y);
    }
}


// File contracts/swap/interfaces/IERC20.sol

pragma solidity >=0.5.0;

interface IERC20 {
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
    event Transfer(address indexed from, address indexed to, uint256 value);

    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function decimals() external view returns (uint8);

    function totalSupply() external view returns (uint256);

    function balanceOf(address owner) external view returns (uint256);

    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    function approve(address spender, uint256 value) external returns (bool);

    function transfer(address to, uint256 value) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external returns (bool);
}


// File contracts/swap/interfaces/IMimoCallee.sol

pragma solidity >=0.5.0;

interface IMimoCallee {
    function mimoCall(
        address sender,
        uint256 amount0,
        uint256 amount1,
        bytes calldata data
    ) external;
}


// File contracts/swap/interfaces/IMimoReferral.sol

pragma solidity >=0.6.2;

interface IMimoReferral {
    event Registered(address indexed user, address indexed referrer);
    event SwapRecorded(
        address indexed user,
        address indexed referrer,
        address token,
        uint256 amount
    );

    function getReferrer(address user) external view returns (address);

    function register(address user, address referrer) external returns (bool);

    function recordSwap(address user, uint256 amount)
        external
        payable
        returns (bool);

    function referrerScore(address token, address referrer)
        external
        view
        returns (uint256 total, uint256 score);

    function clearReferrerScore(address token, address referrer)
        external
        returns (bool);
}


// File contracts/swap/MimoPair.sol

pragma solidity =0.6.12;







contract MimoPair is MimoERC20 {
    using SafeMath for uint256;
    using UQ112x112 for uint224;

    uint256 public constant MINIMUM_LIQUIDITY = 10**3;
    bytes4 private constant SELECTOR =
        bytes4(keccak256(bytes("transfer(address,uint256)")));

    address public factory;
    address public token0;
    address public token1;

    uint112 private reserve0; // uses single storage slot, accessible via getReserves
    uint112 private reserve1; // uses single storage slot, accessible via getReserves
    uint32 private blockTimestampLast; // uses single storage slot, accessible via getReserves

    uint256 public price0CumulativeLast;
    uint256 public price1CumulativeLast;
    uint256 public kLast; // reserve0 * reserve1, as of immediately after the most recent liquidity event

    uint256 private unlocked = 1;
    modifier lock() {
        require(unlocked == 1, "Mimo: LOCKED");
        unlocked = 0;
        _;
        unlocked = 1;
    }

    function getReserves()
        public
        view
        returns (
            uint112 _reserve0,
            uint112 _reserve1,
            uint32 _blockTimestampLast
        )
    {
        _reserve0 = reserve0;
        _reserve1 = reserve1;
        _blockTimestampLast = blockTimestampLast;
    }

    function _safeTransfer(
        address token,
        address to,
        uint256 value
    ) private {
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSelector(SELECTOR, to, value)
        );
        require(
            success && (data.length == 0 || abi.decode(data, (bool))),
            "Mimo: TRANSFER_FAILED"
        );
    }

    event Mint(address indexed sender, uint256 amount0, uint256 amount1);
    event Burn(
        address indexed sender,
        uint256 amount0,
        uint256 amount1,
        address indexed to
    );
    event Swap(
        address indexed sender,
        uint256 amount0In,
        uint256 amount1In,
        uint256 amount0Out,
        uint256 amount1Out,
        address indexed to
    );
    event Sync(uint112 reserve0, uint112 reserve1);

    constructor() public {
        factory = msg.sender;
    }

    // called once by the factory at time of deployment
    function initialize(address _token0, address _token1) external {
        require(msg.sender == factory, "Mimo: FORBIDDEN"); // sufficient check
        token0 = _token0;
        token1 = _token1;
    }

    // update reserves and, on the first call per block, price accumulators
    function _update(
        uint256 balance0,
        uint256 balance1,
        uint112 _reserve0,
        uint112 _reserve1
    ) private {
        require(
            balance0 <= uint112(-1) && balance1 <= uint112(-1),
            "Mimo: OVERFLOW"
        );
        uint32 blockTimestamp = uint32(block.timestamp % 2**32);
        uint32 timeElapsed = blockTimestamp - blockTimestampLast; // overflow is desired
        if (timeElapsed > 0 && _reserve0 != 0 && _reserve1 != 0) {
            // * never overflows, and + overflow is desired
            price0CumulativeLast +=
                uint256(UQ112x112.encode(_reserve1).uqdiv(_reserve0)) *
                timeElapsed;
            price1CumulativeLast +=
                uint256(UQ112x112.encode(_reserve0).uqdiv(_reserve1)) *
                timeElapsed;
        }
        reserve0 = uint112(balance0);
        reserve1 = uint112(balance1);
        blockTimestampLast = blockTimestamp;
        emit Sync(reserve0, reserve1);
    }

    // if fee is on, mint liquidity equivalent to 1/6th of the growth in sqrt(k)
    function _mintFee(uint112 _reserve0, uint112 _reserve1)
        private
        returns (bool feeOn)
    {
        address feeTo = IMimoFactory(factory).feeTo();
        feeOn = feeTo != address(0);
        uint256 _kLast = kLast; // gas savings
        if (feeOn) {
            if (_kLast != 0) {
                uint256 rootK = Math.sqrt(uint256(_reserve0).mul(_reserve1));
                uint256 rootKLast = Math.sqrt(_kLast);
                if (rootK > rootKLast) {
                    uint256 numerator = totalSupply.mul(rootK.sub(rootKLast));
                    uint256 denominator = rootK.mul(3).add(rootKLast);
                    uint256 liquidity = numerator / denominator;
                    if (liquidity > 0) _mint(feeTo, liquidity);
                }
            }
        } else if (_kLast != 0) {
            kLast = 0;
        }
    }

    // this low-level function should be called from a contract which performs important safety checks
    function mint(address to) external lock returns (uint256 liquidity) {
        (uint112 _reserve0, uint112 _reserve1, ) = getReserves(); // gas savings
        uint256 balance0 = IERC20(token0).balanceOf(address(this));
        uint256 balance1 = IERC20(token1).balanceOf(address(this));
        uint256 amount0 = balance0.sub(_reserve0);
        uint256 amount1 = balance1.sub(_reserve1);

        bool feeOn = _mintFee(_reserve0, _reserve1);
        // gas savings, must be defined here since totalSupply can update in _mintFee
        uint256 _totalSupply = totalSupply;
        if (_totalSupply == 0) {
            liquidity = Math.sqrt(amount0.mul(amount1)).sub(MINIMUM_LIQUIDITY);
            _mint(address(0), MINIMUM_LIQUIDITY); // permanently lock the first MINIMUM_LIQUIDITY tokens
        } else {
            liquidity = Math.min(
                amount0.mul(_totalSupply) / _reserve0,
                amount1.mul(_totalSupply) / _reserve1
            );
        }
        require(liquidity > 0, "Mimo: INSUFFICIENT_LIQUIDITY_MINTED");
        _mint(to, liquidity);

        _update(balance0, balance1, _reserve0, _reserve1);
        if (feeOn) kLast = uint256(reserve0).mul(reserve1); // reserve0 and reserve1 are up-to-date
        emit Mint(msg.sender, amount0, amount1);
    }

    // this low-level function should be called from a contract which performs important safety checks
    function burn(address to)
        external
        lock
        returns (uint256 amount0, uint256 amount1)
    {
        (uint112 _reserve0, uint112 _reserve1, ) = getReserves(); // gas savings
        address _token0 = token0; // gas savings
        address _token1 = token1; // gas savings
        uint256 balance0 = IERC20(_token0).balanceOf(address(this));
        uint256 balance1 = IERC20(_token1).balanceOf(address(this));
        uint256 liquidity = balanceOf[address(this)];

        bool feeOn = _mintFee(_reserve0, _reserve1);
        // gas savings, must be defined here since totalSupply can update in _mintFee
        uint256 _totalSupply = totalSupply;
        amount0 = liquidity.mul(balance0) / _totalSupply; // using balances ensures pro-rata distribution
        amount1 = liquidity.mul(balance1) / _totalSupply; // using balances ensures pro-rata distribution
        require(
            amount0 > 0 && amount1 > 0,
            "Mimo: INSUFFICIENT_LIQUIDITY_BURNED"
        );
        _burn(address(this), liquidity);
        _safeTransfer(_token0, to, amount0);
        _safeTransfer(_token1, to, amount1);
        balance0 = IERC20(_token0).balanceOf(address(this));
        balance1 = IERC20(_token1).balanceOf(address(this));

        _update(balance0, balance1, _reserve0, _reserve1);
        if (feeOn) kLast = uint256(reserve0).mul(reserve1); // reserve0 and reserve1 are up-to-date
        emit Burn(msg.sender, amount0, amount1, to);
    }

    // this low-level function should be called from a contract which performs important safety checks
    function swap(
        uint256 amount0Out,
        uint256 amount1Out,
        address to,
        bytes calldata data
    ) external lock {
        require(
            amount0Out > 0 || amount1Out > 0,
            "Mimo: INSUFFICIENT_OUTPUT_AMOUNT"
        );
        (uint112 _reserve0, uint112 _reserve1, ) = getReserves(); // gas savings
        require(
            amount0Out < _reserve0 && amount1Out < _reserve1,
            "Mimo: INSUFFICIENT_LIQUIDITY"
        );

        uint256 balance0;
        uint256 balance1;
        {
            // scope for _token{0,1}, avoids stack too deep errors
            address _token0 = token0;
            address _token1 = token1;
            require(to != _token0 && to != _token1, "Mimo: INVALID_TO");
            if (amount0Out > 0) _safeTransfer(_token0, to, amount0Out); // optimistically transfer tokens
            if (amount1Out > 0) _safeTransfer(_token1, to, amount1Out); // optimistically transfer tokens
            if (data.length > 0)
                IMimoCallee(to).mimoCall(
                    msg.sender,
                    amount0Out,
                    amount1Out,
                    data
                );
            balance0 = IERC20(_token0).balanceOf(address(this));
            balance1 = IERC20(_token1).balanceOf(address(this));
        }
        uint256 amount0In = balance0 > _reserve0 - amount0Out
            ? balance0 - (_reserve0 - amount0Out)
            : 0;
        uint256 amount1In = balance1 > _reserve1 - amount1Out
            ? balance1 - (_reserve1 - amount1Out)
            : 0;
        require(
            amount0In > 0 || amount1In > 0,
            "Mimo: INSUFFICIENT_INPUT_AMOUNT"
        );
        {
            // scope for reserve{0,1}Adjusted, avoids stack too deep errors
            uint256 balance0Adjusted = balance0.mul(1000).sub(amount0In.mul(3));
            uint256 balance1Adjusted = balance1.mul(1000).sub(amount1In.mul(3));
            require(
                balance0Adjusted.mul(balance1Adjusted) >=
                    uint256(_reserve0).mul(_reserve1).mul(1000**2),
                "Mimo: K"
            );
            address _referral = IMimoFactory(factory).referral();
            if (_referral != address(0)) {
                // scope for _amount0Out, avoids stack too deep errors
                uint256 _amount0Out = amount0Out;
                IMimoReferral referral = IMimoReferral(_referral);
                if (_amount0Out > 0) {
                    referral.recordSwap(to, _amount0Out);
                } else {
                    referral.recordSwap(to, amount0In);
                }
            }
        }

        _update(balance0, balance1, _reserve0, _reserve1);
        emit Swap(msg.sender, amount0In, amount1In, amount0Out, amount1Out, to);
    }

    // force balances to match reserves
    function skim(address to) external lock {
        address _token0 = token0; // gas savings
        address _token1 = token1; // gas savings
        _safeTransfer(
            _token0,
            to,
            IERC20(_token0).balanceOf(address(this)).sub(reserve0)
        );
        _safeTransfer(
            _token1,
            to,
            IERC20(_token1).balanceOf(address(this)).sub(reserve1)
        );
    }

    // force reserves to match balances
    function sync() external lock {
        _update(
            IERC20(token0).balanceOf(address(this)),
            IERC20(token1).balanceOf(address(this)),
            reserve0,
            reserve1
        );
    }
}


// File contracts/swap/MimoFactory.sol

pragma solidity =0.6.12;



contract MimoFactory is IMimoFactory {
    bytes32 public constant INIT_CODE_PAIR_HASH =
        keccak256(abi.encodePacked(type(MimoPair).creationCode));

    address public override referral;
    address public override feeTo;
    address public override feeToSetter;

    mapping(address => mapping(address => address)) public override getPair;
    address[] public override allPairs;

    event PairCreated(
        address indexed token0,
        address indexed token1,
        address pair,
        uint256
    );

    constructor(address _feeToSetter) public {
        feeToSetter = _feeToSetter;
    }

    function allPairsLength() external view override returns (uint256) {
        return allPairs.length;
    }

    function createPair(address tokenA, address tokenB)
        external
        override
        returns (address pair)
    {
        require(tokenA != tokenB, "Mimo: IDENTICAL_ADDRESSES");
        (address token0, address token1) = tokenA < tokenB
            ? (tokenA, tokenB)
            : (tokenB, tokenA);
        require(token0 != address(0), "Mimo: ZERO_ADDRESS");
        require(getPair[token0][token1] == address(0), "Mimo: PAIR_EXISTS"); // single check is sufficient
        bytes memory bytecode = type(MimoPair).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        IMimoPair(pair).initialize(token0, token1);
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair; // populate mapping in the reverse direction
        allPairs.push(pair);
        emit PairCreated(token0, token1, pair, allPairs.length);
    }

    function setFeeTo(address _feeTo) external override {
        require(msg.sender == feeToSetter, "Mimo: FORBIDDEN");
        feeTo = _feeTo;
    }

    function setFeeToSetter(address _feeToSetter) external override {
        require(msg.sender == feeToSetter, "Mimo: FORBIDDEN");
        feeToSetter = _feeToSetter;
    }

    function setReferral(address _referral) external override {
        require(msg.sender == feeToSetter, "Mimo: FORBIDDEN");
        referral = _referral;
    }
}
`
  const REMOTE_SERVER = "0.0.0.0:2021";
let client = new proto.iotex.SolcService(REMOTE_SERVER, grpc.credentials.createInsecure());
let compilerInput = {
  version: "0.6.12+commit.27d51765",
  language: "Solidity",
  settings:{
    optimizer:{
      enabled: true,
      runs: 200,
    }
  },
  sources: [
    {
      name: "hello.sol",
      content: source1,
    },
  ],
}
//client.compiler(compilerInput, (err, res) =>{ console.log(res); } );
//client.compilerStandardJSON(compilerInput, (err, res) =>{ console.log(res); } );

let verifierInput = {
    version:"0.6.12+commit.27d51765",
    bytecodeFromChain: "0x608060405234801561001057600080fd5b50600436106100a95760003560e01c80635855a25a116100715780635855a25a146101195780639e5914da14610121578063a2e74af614610149578063c9c653961461016f578063e6a439051461019d578063f46901ed146101cb576100a9565b8063017e7e58146100ae578063094b7415146100d25780631441a5a9146100da5780631e3dd18b146100e2578063574f2ba3146100ff575b600080fd5b6100b66101f1565b604080516001600160a01b039092168252519081900360200190f35b6100b6610200565b6100b661020f565b6100b6600480360360208110156100f857600080fd5b503561021e565b610107610245565b60408051918252519081900360200190f35b61010761024b565b6101476004803603602081101561013757600080fd5b50356001600160a01b03166102de565b005b6101476004803603602081101561015f57600080fd5b50356001600160a01b0316610351565b6100b66004803603604081101561018557600080fd5b506001600160a01b03813581169160200135166103c4565b6100b6600480360360408110156101b357600080fd5b506001600160a01b03813581169160200135166106df565b610147600480360360208110156101e157600080fd5b50356001600160a01b0316610705565b6001546001600160a01b031681565b6002546001600160a01b031681565b6000546001600160a01b031681565b6004818154811061022b57fe5b6000918252602090912001546001600160a01b0316905081565b60045490565b60405161025a60208201610778565b6020820181038252601f19601f820116604052506040516020018082805190602001908083835b602083106102a05780518252601f199092019160209182019101610281565b6001836020036101000a0380198251168184511680821785525050505050509050019150506040516020818303038152906040528051906020012081565b6002546001600160a01b0316331461032f576040805162461bcd60e51b815260206004820152600f60248201526e26b4b6b79d102327a92124a22222a760891b604482015290519081900360640190fd5b600080546001600160a01b0319166001600160a01b0392909216919091179055565b6002546001600160a01b031633146103a2576040805162461bcd60e51b815260206004820152600f60248201526e26b4b6b79d102327a92124a22222a760891b604482015290519081900360640190fd5b600280546001600160a01b0319166001600160a01b0392909216919091179055565b6000816001600160a01b0316836001600160a01b0316141561042d576040805162461bcd60e51b815260206004820152601960248201527f4d696d6f3a204944454e544943414c5f41444452455353455300000000000000604482015290519081900360640190fd5b600080836001600160a01b0316856001600160a01b031610610450578385610453565b84845b90925090506001600160a01b0382166104a8576040805162461bcd60e51b81526020600482015260126024820152714d696d6f3a205a45524f5f4144445245535360701b604482015290519081900360640190fd5b6001600160a01b03828116600090815260036020908152604080832085851684529091529020541615610516576040805162461bcd60e51b81526020600482015260116024820152704d696d6f3a20504149525f45584953545360781b604482015290519081900360640190fd5b60606040518060200161052890610778565b6020820181038252601f19601f8201166040525090506000838360405160200180836001600160a01b031660601b8152601401826001600160a01b031660601b815260140192505050604051602081830303815290604052805190602001209050808251602084016000f59450846001600160a01b031663485cc95585856040518363ffffffff1660e01b815260040180836001600160a01b03168152602001826001600160a01b0316815260200192505050600060405180830381600087803b1580156105f557600080fd5b505af1158015610609573d6000803e3d6000fd5b505050506001600160a01b0384811660008181526003602081815260408084208987168086529083528185208054978d166001600160a01b031998891681179091559383528185208686528352818520805488168517905560048054600181018255958190527f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b90950180549097168417909655925483519283529082015281517f0d3648bd0f6ba80134a33ba9275ac585d9d315f0ad8355cddefde31afa28d0e9929181900390910190a35050505092915050565b60036020908152600092835260408084209091529082529020546001600160a01b031681565b6002546001600160a01b03163314610756576040805162461bcd60e51b815260206004820152600f60248201526e26b4b6b79d102327a92124a22222a760891b604482015290519081900360640190fd5b600180546001600160a01b0319166001600160a01b0392909216919091179055565b612029806107868339019056fe60806040526001600a5534801561001557600080fd5b50600380546001600160a01b03191633179055611ff2806100376000396000f3fe608060405234801561001057600080fd5b506004361061014d5760003560e01c80636a627842116100c3578063ba9a7a561161007c578063ba9a7a561461046c578063bc25cf7714610474578063c45a01551461049a578063d21220a7146104a2578063dd62ed3e146104aa578063fff6cae9146104d85761014d565b80636a627842146103a557806370a08231146103cb5780637464fc3d146103f157806389afcb44146103f957806395d89b4114610438578063a9059cbb146104405761014d565b806318160ddd1161011557806318160ddd146102f957806323b872dd14610313578063313ce56714610349578063485cc955146103675780635909c0d5146103955780635a3d54931461039d5761014d565b8063022c0d9f1461015257806306fdde03146101e05780630902f1ac1461025d578063095ea7b3146102955780630dfe1681146102d5575b600080fd5b6101de6004803603608081101561016857600080fd5b8135916020810135916001600160a01b03604083013516919081019060808101606082013564010000000081111561019f57600080fd5b8201836020820111156101b157600080fd5b803590602001918460018302840111640100000000831117156101d357600080fd5b5090925090506104e0565b005b6101e8610bb6565b6040805160208082528351818301528351919283929083019185019080838360005b8381101561022257818101518382015260200161020a565b50505050905090810190601f16801561024f5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b610265610bda565b604080516001600160701b03948516815292909316602083015263ffffffff168183015290519081900360600190f35b6102c1600480360360408110156102ab57600080fd5b506001600160a01b038135169060200135610c04565b604080519115158252519081900360200190f35b6102dd610c1b565b604080516001600160a01b039092168252519081900360200190f35b610301610c2a565b60408051918252519081900360200190f35b6102c16004803603606081101561032957600080fd5b506001600160a01b03813581169160208101359091169060400135610c30565b610351610cc4565b6040805160ff9092168252519081900360200190f35b6101de6004803603604081101561037d57600080fd5b506001600160a01b0381358116916020013516610cc9565b610301610d48565b610301610d4e565b610301600480360360208110156103bb57600080fd5b50356001600160a01b0316610d54565b610301600480360360208110156103e157600080fd5b50356001600160a01b031661102e565b610301611040565b61041f6004803603602081101561040f57600080fd5b50356001600160a01b0316611046565b6040805192835260208301919091528051918290030190f35b6101e86113d8565b6102c16004803603604081101561045657600080fd5b506001600160a01b0381351690602001356113fb565b610301611408565b6101de6004803603602081101561048a57600080fd5b50356001600160a01b031661140e565b6102dd61157f565b6102dd61158e565b610301600480360360408110156104c057600080fd5b506001600160a01b038135811691602001351661159d565b6101de6115ba565b600a54600114610526576040805162461bcd60e51b815260206004820152600c60248201526b135a5b5bce881313d0d2d15160a21b604482015290519081900360640190fd5b6000600a55841515806105395750600084115b61058a576040805162461bcd60e51b815260206004820181905260248201527f4d696d6f3a20494e53554646494349454e545f4f55545055545f414d4f554e54604482015290519081900360640190fd5b600080610595610bda565b5091509150816001600160701b0316871080156105ba5750806001600160701b031686105b61060b576040805162461bcd60e51b815260206004820152601c60248201527f4d696d6f3a20494e53554646494349454e545f4c495155494449545900000000604482015290519081900360640190fd5b60045460055460009182916001600160a01b039182169190811690891682148015906106495750806001600160a01b0316896001600160a01b031614155b61068d576040805162461bcd60e51b815260206004820152601060248201526f4d696d6f3a20494e56414c49445f544f60801b604482015290519081900360640190fd5b8a1561069e5761069e828a8d61171b565b89156106af576106af818a8c61171b565b861561076157886001600160a01b03166359fa589e338d8d8c8c6040518663ffffffff1660e01b815260040180866001600160a01b03168152602001858152602001848152602001806020018281038252848482818152602001925080828437600081840152601f19601f8201169050808301925050509650505050505050600060405180830381600087803b15801561074857600080fd5b505af115801561075c573d6000803e3d6000fd5b505050505b604080516370a0823160e01b815230600482015290516001600160a01b038416916370a08231916024808301926020929190829003018186803b1580156107a757600080fd5b505afa1580156107bb573d6000803e3d6000fd5b505050506040513d60208110156107d157600080fd5b5051604080516370a0823160e01b815230600482015290519195506001600160a01b038316916370a0823191602480820192602092909190829003018186803b15801561081d57600080fd5b505afa158015610831573d6000803e3d6000fd5b505050506040513d602081101561084757600080fd5b5051925060009150506001600160701b0385168a9003831161086a576000610879565b89856001600160701b03160383035b9050600089856001600160701b03160383116108965760006108a5565b89856001600160701b03160383035b905060008211806108b65750600081115b610907576040805162461bcd60e51b815260206004820152601f60248201527f4d696d6f3a20494e53554646494349454e545f494e5055545f414d4f554e5400604482015290519081900360640190fd5b60006109296109178460036118ad565b610923876103e86118ad565b90611910565b9050600061093b6109178460036118ad565b9050610960620f424061095a6001600160701b038b8116908b166118ad565b906118ad565b61096a83836118ad565b10156109a7576040805162461bcd60e51b81526020600482015260076024820152664d696d6f3a204b60c81b604482015290519081900360640190fd5b60035460408051631441a5a960e01b815290516000926001600160a01b031691631441a5a9916004808301926020929190829003018186803b1580156109ec57600080fd5b505afa158015610a00573d6000803e3d6000fd5b505050506040513d6020811015610a1657600080fd5b505190506001600160a01b03811615610b41578d818115610aba57806001600160a01b031663096801358f846040518363ffffffff1660e01b815260040180836001600160a01b0316815260200182815260200192505050602060405180830381600087803b158015610a8857600080fd5b505af1158015610a9c573d6000803e3d6000fd5b505050506040513d6020811015610ab257600080fd5b50610b3e9050565b806001600160a01b031663096801358f896040518363ffffffff1660e01b815260040180836001600160a01b0316815260200182815260200192505050602060405180830381600087803b158015610b1157600080fd5b505af1158015610b25573d6000803e3d6000fd5b505050506040513d6020811015610b3b57600080fd5b50505b50505b505050610b5084848888611960565b60408051838152602081018390528082018d9052606081018c905290516001600160a01b038b169133917fd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d8229181900360800190a350506001600a55505050505050505050565b604051806040016040528060088152602001674d494d4f204c507360c01b81525081565b6006546001600160701b0380821692600160701b830490911691600160e01b900463ffffffff1690565b6000610c11338484611b1a565b5060015b92915050565b6004546001600160a01b031681565b60005481565b6001600160a01b038316600090815260026020908152604080832033845290915281205460001914610caf576001600160a01b0384166000908152600260209081526040808320338452909152902054610c8a9083611910565b6001600160a01b03851660009081526002602090815260408083203384529091529020555b610cba848484611b7c565b5060019392505050565b601281565b6003546001600160a01b03163314610d1a576040805162461bcd60e51b815260206004820152600f60248201526e26b4b6b79d102327a92124a22222a760891b604482015290519081900360640190fd5b600480546001600160a01b039384166001600160a01b03199182161790915560058054929093169116179055565b60075481565b60085481565b6000600a54600114610d9c576040805162461bcd60e51b815260206004820152600c60248201526b135a5b5bce881313d0d2d15160a21b604482015290519081900360640190fd5b6000600a81905580610dac610bda565b5060048054604080516370a0823160e01b81523093810193909352519395509193506000926001600160a01b03909216916370a0823191602480820192602092909190829003018186803b158015610e0357600080fd5b505afa158015610e17573d6000803e3d6000fd5b505050506040513d6020811015610e2d57600080fd5b5051600554604080516370a0823160e01b815230600482015290519293506000926001600160a01b03909216916370a0823191602480820192602092909190829003018186803b158015610e8057600080fd5b505afa158015610e94573d6000803e3d6000fd5b505050506040513d6020811015610eaa57600080fd5b505190506000610ec3836001600160701b038716611910565b90506000610eda836001600160701b038716611910565b90506000610ee88787611c2a565b60005490915080610f1f57610f0b6103e8610923610f0687876118ad565b611d6a565b9850610f1a60006103e8611dbc565b610f62565b610f5f6001600160701b038916610f3686846118ad565b81610f3d57fe5b046001600160701b038916610f5286856118ad565b81610f5957fe5b04611e46565b98505b60008911610fa15760405162461bcd60e51b8152600401808060200182810382526023815260200180611f9a6023913960400191505060405180910390fd5b610fab8a8a611dbc565b610fb786868a8a611960565b8115610fe157600654610fdd906001600160701b0380821691600160701b9004166118ad565b6009555b6040805185815260208101859052815133927f4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f928290030190a250506001600a5550949695505050505050565b60016020526000908152604090205481565b60095481565b600080600a5460011461108f576040805162461bcd60e51b815260206004820152600c60248201526b135a5b5bce881313d0d2d15160a21b604482015290519081900360640190fd5b6000600a8190558061109f610bda565b5060048054600554604080516370a0823160e01b81523094810194909452519496509294506001600160a01b039081169392169160009184916370a0823191602480820192602092909190829003018186803b1580156110fe57600080fd5b505afa158015611112573d6000803e3d6000fd5b505050506040513d602081101561112857600080fd5b5051604080516370a0823160e01b815230600482015290519192506000916001600160a01b038516916370a08231916024808301926020929190829003018186803b15801561117657600080fd5b505afa15801561118a573d6000803e3d6000fd5b505050506040513d60208110156111a057600080fd5b5051306000908152600160205260408120549192506111bf8888611c2a565b600054909150806111d084876118ad565b816111d757fe5b049a50806111e584866118ad565b816111ec57fe5b04995060008b1180156111ff575060008a115b61123a5760405162461bcd60e51b8152600401808060200182810382526023815260200180611f776023913960400191505060405180910390fd5b6112443084611e5e565b61124f878d8d61171b565b61125a868d8c61171b565b604080516370a0823160e01b815230600482015290516001600160a01b038916916370a08231916024808301926020929190829003018186803b1580156112a057600080fd5b505afa1580156112b4573d6000803e3d6000fd5b505050506040513d60208110156112ca57600080fd5b5051604080516370a0823160e01b815230600482015290519196506001600160a01b038816916370a0823191602480820192602092909190829003018186803b15801561131657600080fd5b505afa15801561132a573d6000803e3d6000fd5b505050506040513d602081101561134057600080fd5b5051935061135085858b8b611960565b811561137a57600654611376906001600160701b0380821691600160701b9004166118ad565b6009555b604080518c8152602081018c905281516001600160a01b038f169233927fdccd412f0b1252819cb1fd330b93224ca42612892bb3f4f789976e6d81936496929081900390910190a35050505050505050506001600a81905550915091565b6040518060400160405280600781526020016604d494d4f2d4c560cc1b81525081565b6000610c11338484611b7c565b6103e881565b600a54600114611454576040805162461bcd60e51b815260206004820152600c60248201526b135a5b5bce881313d0d2d15160a21b604482015290519081900360640190fd5b6000600a5560048054600554600654604080516370a0823160e01b81523095810195909552516001600160a01b0393841694939092169261150192859287926114fc926001600160701b039092169185916370a08231916024808301926020929190829003018186803b1580156114ca57600080fd5b505afa1580156114de573d6000803e3d6000fd5b505050506040513d60208110156114f457600080fd5b505190611910565b61171b565b61157581846114fc6006600e9054906101000a90046001600160701b03166001600160701b0316856001600160a01b03166370a08231306040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b1580156114ca57600080fd5b50506001600a5550565b6003546001600160a01b031681565b6005546001600160a01b031681565b600260209081526000928352604080842090915290825290205481565b600a54600114611600576040805162461bcd60e51b815260206004820152600c60248201526b135a5b5bce881313d0d2d15160a21b604482015290519081900360640190fd5b6000600a5560048054604080516370a0823160e01b8152309381019390935251611714926001600160a01b03909216916370a08231916024808301926020929190829003018186803b15801561165557600080fd5b505afa158015611669573d6000803e3d6000fd5b505050506040513d602081101561167f57600080fd5b5051600554604080516370a0823160e01b815230600482015290516001600160a01b03909216916370a0823191602480820192602092909190829003018186803b1580156116cc57600080fd5b505afa1580156116e0573d6000803e3d6000fd5b505050506040513d60208110156116f657600080fd5b50516006546001600160701b0380821691600160701b900416611960565b6001600a55565b604080518082018252601981527f7472616e7366657228616464726573732c75696e74323536290000000000000060209182015281516001600160a01b0385811660248301526044808301869052845180840390910181526064909201845291810180516001600160e01b031663a9059cbb60e01b1781529251815160009460609489169392918291908083835b602083106117c85780518252601f1990920191602091820191016117a9565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d806000811461182a576040519150601f19603f3d011682016040523d82523d6000602084013e61182f565b606091505b509150915081801561185d57508051158061185d575080806020019051602081101561185a57600080fd5b50515b6118a6576040805162461bcd60e51b8152602060048201526015602482015274135a5b5bce881514905394d1915497d19052531151605a1b604482015290519081900360640190fd5b5050505050565b60008115806118c8575050808202828282816118c557fe5b04145b610c15576040805162461bcd60e51b815260206004820152601460248201527364732d6d6174682d6d756c2d6f766572666c6f7760601b604482015290519081900360640190fd5b80820382811115610c15576040805162461bcd60e51b815260206004820152601560248201527464732d6d6174682d7375622d756e646572666c6f7760581b604482015290519081900360640190fd5b6001600160701b03841180159061197e57506001600160701b038311155b6119c0576040805162461bcd60e51b815260206004820152600e60248201526d4d696d6f3a204f564552464c4f5760901b604482015290519081900360640190fd5b60065463ffffffff42811691600160e01b900481168203908116158015906119f057506001600160701b03841615155b8015611a0457506001600160701b03831615155b15611a6f578063ffffffff16611a2c85611a1d86611ef0565b6001600160e01b031690611f02565b600780546001600160e01b03929092169290920201905563ffffffff8116611a5784611a1d87611ef0565b600880546001600160e01b0392909216929092020190555b600680546dffffffffffffffffffffffffffff19166001600160701b03888116919091176dffffffffffffffffffffffffffff60701b1916600160701b8883168102919091176001600160e01b0316600160e01b63ffffffff871602179283905560408051848416815291909304909116602082015281517f1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1929181900390910190a1505050505050565b6001600160a01b03808416600081815260026020908152604080832094871680845294825291829020859055815185815291517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259281900390910190a3505050565b6001600160a01b038316600090815260016020526040902054611b9f9082611910565b6001600160a01b038085166000908152600160205260408082209390935590841681522054611bce9082611f27565b6001600160a01b0380841660008181526001602090815260409182902094909455805185815290519193928716927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef92918290030190a3505050565b600080600360009054906101000a90046001600160a01b03166001600160a01b031663017e7e586040518163ffffffff1660e01b815260040160206040518083038186803b158015611c7b57600080fd5b505afa158015611c8f573d6000803e3d6000fd5b505050506040513d6020811015611ca557600080fd5b50516009546001600160a01b038216158015945091925090611d56578015611d51576000611ce2610f066001600160701b038881169088166118ad565b90506000611cef83611d6a565b905080821115611d4e576000611d11611d088484611910565b600054906118ad565b90506000611d2a83611d248660036118ad565b90611f27565b90506000818381611d3757fe5b0490508015611d4a57611d4a8782611dbc565b5050505b50505b611d62565b8015611d625760006009555b505092915050565b60006003821115611dad575080600160028204015b81811015611da757809150600281828581611d9657fe5b040181611d9f57fe5b049050611d7f565b50611db7565b8115611db7575060015b919050565b600054611dc99082611f27565b60009081556001600160a01b038316815260016020526040902054611dee9082611f27565b6001600160a01b03831660008181526001602090815260408083209490945583518581529351929391927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9281900390910190a35050565b6000818310611e555781611e57565b825b9392505050565b6001600160a01b038216600090815260016020526040902054611e819082611910565b6001600160a01b03831660009081526001602052604081209190915554611ea89082611910565b60009081556040805183815290516001600160a01b038516917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef919081900360200190a35050565b6001600160701b0316600160701b0290565b60006001600160701b0382166001600160e01b03841681611f1f57fe5b049392505050565b80820182811015610c15576040805162461bcd60e51b815260206004820152601460248201527364732d6d6174682d6164642d6f766572666c6f7760601b604482015290519081900360640190fdfe4d696d6f3a20494e53554646494349454e545f4c49515549444954595f4255524e45444d696d6f3a20494e53554646494349454e545f4c49515549444954595f4d494e544544a2646970667358221220ef1e588166a2db17619885bb73d558ddb441fae8b80a0aa162f53b15955baaf464736f6c634300060c0033a264697066735822122096af53590542bb93dc2c7873f246d35e2a1fdf1f03be4f485b98b041d57dca7764736f6c634300060c0033",
    bytecodeFromCompiler:"608060405234801561001057600080fd5b506004361061014d5760003560e01c80636a627842116100c3578063ba9a7a561161007c578063ba9a7a561461046c578063bc25cf7714610474578063c45a01551461049a578063d21220a7146104a2578063dd62ed3e146104aa578063fff6cae9146104d85761014d565b80636a627842146103a557806370a08231146103cb5780637464fc3d146103f157806389afcb44146103f957806395d89b4114610438578063a9059cbb146104405761014d565b806318160ddd1161011557806318160ddd146102f957806323b872dd14610313578063313ce56714610349578063485cc955146103675780635909c0d5146103955780635a3d54931461039d5761014d565b8063022c0d9f1461015257806306fdde03146101e05780630902f1ac1461025d578063095ea7b3146102955780630dfe1681146102d5575b600080fd5b6101de6004803603608081101561016857600080fd5b8135916020810135916001600160a01b03604083013516919081019060808101606082013564010000000081111561019f57600080fd5b8201836020820111156101b157600080fd5b803590602001918460018302840111640100000000831117156101d357600080fd5b5090925090506104e0565b005b6101e8610bb6565b6040805160208082528351818301528351919283929083019185019080838360005b8381101561022257818101518382015260200161020a565b50505050905090810190601f16801561024f5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b610265610bda565b604080516001600160701b03948516815292909316602083015263ffffffff168183015290519081900360600190f35b6102c1600480360360408110156102ab57600080fd5b506001600160a01b038135169060200135610c04565b604080519115158252519081900360200190f35b6102dd610c1b565b604080516001600160a01b039092168252519081900360200190f35b610301610c2a565b60408051918252519081900360200190f35b6102c16004803603606081101561032957600080fd5b506001600160a01b03813581169160208101359091169060400135610c30565b610351610cc4565b6040805160ff9092168252519081900360200190f35b6101de6004803603604081101561037d57600080fd5b506001600160a01b0381358116916020013516610cc9565b610301610d48565b610301610d4e565b610301600480360360208110156103bb57600080fd5b50356001600160a01b0316610d54565b610301600480360360208110156103e157600080fd5b50356001600160a01b031661102e565b610301611040565b61041f6004803603602081101561040f57600080fd5b50356001600160a01b0316611046565b6040805192835260208301919091528051918290030190f35b6101e86113d8565b6102c16004803603604081101561045657600080fd5b506001600160a01b0381351690602001356113fb565b610301611408565b6101de6004803603602081101561048a57600080fd5b50356001600160a01b031661140e565b6102dd61157f565b6102dd61158e565b610301600480360360408110156104c057600080fd5b506001600160a01b038135811691602001351661159d565b6101de6115ba565b600a54600114610526576040805162461bcd60e51b815260206004820152600c60248201526b135a5b5bce881313d0d2d15160a21b604482015290519081900360640190fd5b6000600a55841515806105395750600084115b61058a576040805162461bcd60e51b815260206004820181905260248201527f4d696d6f3a20494e53554646494349454e545f4f55545055545f414d4f554e54604482015290519081900360640190fd5b600080610595610bda565b5091509150816001600160701b0316871080156105ba5750806001600160701b031686105b61060b576040805162461bcd60e51b815260206004820152601c60248201527f4d696d6f3a20494e53554646494349454e545f4c495155494449545900000000604482015290519081900360640190fd5b60045460055460009182916001600160a01b039182169190811690891682148015906106495750806001600160a01b0316896001600160a01b031614155b61068d576040805162461bcd60e51b815260206004820152601060248201526f4d696d6f3a20494e56414c49445f544f60801b604482015290519081900360640190fd5b8a1561069e5761069e828a8d61171b565b89156106af576106af818a8c61171b565b861561076157886001600160a01b03166359fa589e338d8d8c8c6040518663ffffffff1660e01b815260040180866001600160a01b03168152602001858152602001848152602001806020018281038252848482818152602001925080828437600081840152601f19601f8201169050808301925050509650505050505050600060405180830381600087803b15801561074857600080fd5b505af115801561075c573d6000803e3d6000fd5b505050505b604080516370a0823160e01b815230600482015290516001600160a01b038416916370a08231916024808301926020929190829003018186803b1580156107a757600080fd5b505afa1580156107bb573d6000803e3d6000fd5b505050506040513d60208110156107d157600080fd5b5051604080516370a0823160e01b815230600482015290519195506001600160a01b038316916370a0823191602480820192602092909190829003018186803b15801561081d57600080fd5b505afa158015610831573d6000803e3d6000fd5b505050506040513d602081101561084757600080fd5b5051925060009150506001600160701b0385168a9003831161086a576000610879565b89856001600160701b03160383035b9050600089856001600160701b03160383116108965760006108a5565b89856001600160701b03160383035b905060008211806108b65750600081115b610907576040805162461bcd60e51b815260206004820152601f60248201527f4d696d6f3a20494e53554646494349454e545f494e5055545f414d4f554e5400604482015290519081900360640190fd5b60006109296109178460036118ad565b610923876103e86118ad565b90611910565b9050600061093b6109178460036118ad565b9050610960620f424061095a6001600160701b038b8116908b166118ad565b906118ad565b61096a83836118ad565b10156109a7576040805162461bcd60e51b81526020600482015260076024820152664d696d6f3a204b60c81b604482015290519081900360640190fd5b60035460408051631441a5a960e01b815290516000926001600160a01b031691631441a5a9916004808301926020929190829003018186803b1580156109ec57600080fd5b505afa158015610a00573d6000803e3d6000fd5b505050506040513d6020811015610a1657600080fd5b505190506001600160a01b03811615610b41578d818115610aba57806001600160a01b031663096801358f846040518363ffffffff1660e01b815260040180836001600160a01b0316815260200182815260200192505050602060405180830381600087803b158015610a8857600080fd5b505af1158015610a9c573d6000803e3d6000fd5b505050506040513d6020811015610ab257600080fd5b50610b3e9050565b806001600160a01b031663096801358f896040518363ffffffff1660e01b815260040180836001600160a01b0316815260200182815260200192505050602060405180830381600087803b158015610b1157600080fd5b505af1158015610b25573d6000803e3d6000fd5b505050506040513d6020811015610b3b57600080fd5b50505b50505b505050610b5084848888611960565b60408051838152602081018390528082018d9052606081018c905290516001600160a01b038b169133917fd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d8229181900360800190a350506001600a55505050505050505050565b604051806040016040528060088152602001674d494d4f204c507360c01b81525081565b6006546001600160701b0380821692600160701b830490911691600160e01b900463ffffffff1690565b6000610c11338484611b1a565b5060015b92915050565b6004546001600160a01b031681565b60005481565b6001600160a01b038316600090815260026020908152604080832033845290915281205460001914610caf576001600160a01b0384166000908152600260209081526040808320338452909152902054610c8a9083611910565b6001600160a01b03851660009081526002602090815260408083203384529091529020555b610cba848484611b7c565b5060019392505050565b601281565b6003546001600160a01b03163314610d1a576040805162461bcd60e51b815260206004820152600f60248201526e26b4b6b79d102327a92124a22222a760891b604482015290519081900360640190fd5b600480546001600160a01b039384166001600160a01b03199182161790915560058054929093169116179055565b60075481565b60085481565b6000600a54600114610d9c576040805162461bcd60e51b815260206004820152600c60248201526b135a5b5bce881313d0d2d15160a21b604482015290519081900360640190fd5b6000600a81905580610dac610bda565b5060048054604080516370a0823160e01b81523093810193909352519395509193506000926001600160a01b03909216916370a0823191602480820192602092909190829003018186803b158015610e0357600080fd5b505afa158015610e17573d6000803e3d6000fd5b505050506040513d6020811015610e2d57600080fd5b5051600554604080516370a0823160e01b815230600482015290519293506000926001600160a01b03909216916370a0823191602480820192602092909190829003018186803b158015610e8057600080fd5b505afa158015610e94573d6000803e3d6000fd5b505050506040513d6020811015610eaa57600080fd5b505190506000610ec3836001600160701b038716611910565b90506000610eda836001600160701b038716611910565b90506000610ee88787611c2a565b60005490915080610f1f57610f0b6103e8610923610f0687876118ad565b611d6a565b9850610f1a60006103e8611dbc565b610f62565b610f5f6001600160701b038916610f3686846118ad565b81610f3d57fe5b046001600160701b038916610f5286856118ad565b81610f5957fe5b04611e46565b98505b60008911610fa15760405162461bcd60e51b8152600401808060200182810382526023815260200180611f9a6023913960400191505060405180910390fd5b610fab8a8a611dbc565b610fb786868a8a611960565b8115610fe157600654610fdd906001600160701b0380821691600160701b9004166118ad565b6009555b6040805185815260208101859052815133927f4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f928290030190a250506001600a5550949695505050505050565b60016020526000908152604090205481565b60095481565b600080600a5460011461108f576040805162461bcd60e51b815260206004820152600c60248201526b135a5b5bce881313d0d2d15160a21b604482015290519081900360640190fd5b6000600a8190558061109f610bda565b5060048054600554604080516370a0823160e01b81523094810194909452519496509294506001600160a01b039081169392169160009184916370a0823191602480820192602092909190829003018186803b1580156110fe57600080fd5b505afa158015611112573d6000803e3d6000fd5b505050506040513d602081101561112857600080fd5b5051604080516370a0823160e01b815230600482015290519192506000916001600160a01b038516916370a08231916024808301926020929190829003018186803b15801561117657600080fd5b505afa15801561118a573d6000803e3d6000fd5b505050506040513d60208110156111a057600080fd5b5051306000908152600160205260408120549192506111bf8888611c2a565b600054909150806111d084876118ad565b816111d757fe5b049a50806111e584866118ad565b816111ec57fe5b04995060008b1180156111ff575060008a115b61123a5760405162461bcd60e51b8152600401808060200182810382526023815260200180611f776023913960400191505060405180910390fd5b6112443084611e5e565b61124f878d8d61171b565b61125a868d8c61171b565b604080516370a0823160e01b815230600482015290516001600160a01b038916916370a08231916024808301926020929190829003018186803b1580156112a057600080fd5b505afa1580156112b4573d6000803e3d6000fd5b505050506040513d60208110156112ca57600080fd5b5051604080516370a0823160e01b815230600482015290519196506001600160a01b038816916370a0823191602480820192602092909190829003018186803b15801561131657600080fd5b505afa15801561132a573d6000803e3d6000fd5b505050506040513d602081101561134057600080fd5b5051935061135085858b8b611960565b811561137a57600654611376906001600160701b0380821691600160701b9004166118ad565b6009555b604080518c8152602081018c905281516001600160a01b038f169233927fdccd412f0b1252819cb1fd330b93224ca42612892bb3f4f789976e6d81936496929081900390910190a35050505050505050506001600a81905550915091565b6040518060400160405280600781526020016604d494d4f2d4c560cc1b81525081565b6000610c11338484611b7c565b6103e881565b600a54600114611454576040805162461bcd60e51b815260206004820152600c60248201526b135a5b5bce881313d0d2d15160a21b604482015290519081900360640190fd5b6000600a5560048054600554600654604080516370a0823160e01b81523095810195909552516001600160a01b0393841694939092169261150192859287926114fc926001600160701b039092169185916370a08231916024808301926020929190829003018186803b1580156114ca57600080fd5b505afa1580156114de573d6000803e3d6000fd5b505050506040513d60208110156114f457600080fd5b505190611910565b61171b565b61157581846114fc6006600e9054906101000a90046001600160701b03166001600160701b0316856001600160a01b03166370a08231306040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b1580156114ca57600080fd5b50506001600a5550565b6003546001600160a01b031681565b6005546001600160a01b031681565b600260209081526000928352604080842090915290825290205481565b600a54600114611600576040805162461bcd60e51b815260206004820152600c60248201526b135a5b5bce881313d0d2d15160a21b604482015290519081900360640190fd5b6000600a5560048054604080516370a0823160e01b8152309381019390935251611714926001600160a01b03909216916370a08231916024808301926020929190829003018186803b15801561165557600080fd5b505afa158015611669573d6000803e3d6000fd5b505050506040513d602081101561167f57600080fd5b5051600554604080516370a0823160e01b815230600482015290516001600160a01b03909216916370a0823191602480820192602092909190829003018186803b1580156116cc57600080fd5b505afa1580156116e0573d6000803e3d6000fd5b505050506040513d60208110156116f657600080fd5b50516006546001600160701b0380821691600160701b900416611960565b6001600a55565b604080518082018252601981527f7472616e7366657228616464726573732c75696e74323536290000000000000060209182015281516001600160a01b0385811660248301526044808301869052845180840390910181526064909201845291810180516001600160e01b031663a9059cbb60e01b1781529251815160009460609489169392918291908083835b602083106117c85780518252601f1990920191602091820191016117a9565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d806000811461182a576040519150601f19603f3d011682016040523d82523d6000602084013e61182f565b606091505b509150915081801561185d57508051158061185d575080806020019051602081101561185a57600080fd5b50515b6118a6576040805162461bcd60e51b8152602060048201526015602482015274135a5b5bce881514905394d1915497d19052531151605a1b604482015290519081900360640190fd5b5050505050565b60008115806118c8575050808202828282816118c557fe5b04145b610c15576040805162461bcd60e51b815260206004820152601460248201527364732d6d6174682d6d756c2d6f766572666c6f7760601b604482015290519081900360640190fd5b80820382811115610c15576040805162461bcd60e51b815260206004820152601560248201527464732d6d6174682d7375622d756e646572666c6f7760581b604482015290519081900360640190fd5b6001600160701b03841180159061197e57506001600160701b038311155b6119c0576040805162461bcd60e51b815260206004820152600e60248201526d4d696d6f3a204f564552464c4f5760901b604482015290519081900360640190fd5b60065463ffffffff42811691600160e01b900481168203908116158015906119f057506001600160701b03841615155b8015611a0457506001600160701b03831615155b15611a6f578063ffffffff16611a2c85611a1d86611ef0565b6001600160e01b031690611f02565b600780546001600160e01b03929092169290920201905563ffffffff8116611a5784611a1d87611ef0565b600880546001600160e01b0392909216929092020190555b600680546dffffffffffffffffffffffffffff19166001600160701b03888116919091176dffffffffffffffffffffffffffff60701b1916600160701b8883168102919091176001600160e01b0316600160e01b63ffffffff871602179283905560408051848416815291909304909116602082015281517f1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1929181900390910190a1505050505050565b6001600160a01b03808416600081815260026020908152604080832094871680845294825291829020859055815185815291517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259281900390910190a3505050565b6001600160a01b038316600090815260016020526040902054611b9f9082611910565b6001600160a01b038085166000908152600160205260408082209390935590841681522054611bce9082611f27565b6001600160a01b0380841660008181526001602090815260409182902094909455805185815290519193928716927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef92918290030190a3505050565b600080600360009054906101000a90046001600160a01b03166001600160a01b031663017e7e586040518163ffffffff1660e01b815260040160206040518083038186803b158015611c7b57600080fd5b505afa158015611c8f573d6000803e3d6000fd5b505050506040513d6020811015611ca557600080fd5b50516009546001600160a01b038216158015945091925090611d56578015611d51576000611ce2610f066001600160701b038881169088166118ad565b90506000611cef83611d6a565b905080821115611d4e576000611d11611d088484611910565b600054906118ad565b90506000611d2a83611d248660036118ad565b90611f27565b90506000818381611d3757fe5b0490508015611d4a57611d4a8782611dbc565b5050505b50505b611d62565b8015611d625760006009555b505092915050565b60006003821115611dad575080600160028204015b81811015611da757809150600281828581611d9657fe5b040181611d9f57fe5b049050611d7f565b50611db7565b8115611db7575060015b919050565b600054611dc99082611f27565b60009081556001600160a01b038316815260016020526040902054611dee9082611f27565b6001600160a01b03831660008181526001602090815260408083209490945583518581529351929391927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9281900390910190a35050565b6000818310611e555781611e57565b825b9392505050565b6001600160a01b038216600090815260016020526040902054611e819082611910565b6001600160a01b03831660009081526001602052604081209190915554611ea89082611910565b60009081556040805183815290516001600160a01b038516917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef919081900360200190a35050565b6001600160701b0316600160701b0290565b60006001600160701b0382166001600160e01b03841681611f1f57fe5b049392505050565b80820182811015610c15576040805162461bcd60e51b815260206004820152601460248201527364732d6d6174682d6164642d6f766572666c6f7760601b604482015290519081900360640190fdfe4d696d6f3a20494e53554646494349454e545f4c49515549444954595f4255524e45444d696d6f3a20494e53554646494349454e545f4c49515549444954595f4d494e544544a2646970667358221220c20da1a5b31e37b5f58d8c744660ac9c26faf7362b0d28fc54933a81343a6bd464736f6c634300060c0033"
  }
  client.verifier(verifierInput, (err, res) =>{ console.log(res); } );