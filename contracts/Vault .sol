// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract VaultToken is ReentrancyGuard {
    using SafeMath for uint256;
    uint256 public depositFeePercentage = 0;
    uint256 public withdrawalFeePercentage = 0;

    address public owner;
    struct TokenInfo {
        string tokenName;
        bool isActive;
    }
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );
    mapping(address => TokenInfo) public whiteListTokens;
    mapping(address => mapping(address => uint256)) public tokenBalanceByWallet;
    event Deposit(
        address indexed walletAddress,
        address tokenAddress,
        uint256 amount
    );
    event Withdrawn(
        address indexed walletAddress,
        address tokenAddress,
        uint256 amount
    );
    event TokenAdded(address indexed tokenAddress);
    event TokenRemoved(address indexed tokenAddress);
    event ManagerRemoved(address indexed manager);
    event ManagerAdded(address indexed manager);
    event BalanceIncreased(
        address indexed walletAddress,
        address tokenAddress,
        uint256 amount
    );
    event BalanceDecreased(
        address indexed walletAddress,
        address tokenAddess,
        uint256 amount
    );
    event FeesUpdated(uint256 newDepositFee, uint256 newWithdrawalFee);
    mapping(address => bool) private managers;

    modifier onlyOwner() {
        require(owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }
    modifier onlyManager() {
        require(managers[msg.sender] || owner == msg.sender, "Not authorized");
        _;
    }

    modifier validateToken(address tokenAddress) {
        require(whiteListTokens[tokenAddress].isActive, "Token is not active");
        _;
    }
    enum Role {
        Customer,
        Owner,
        Manager
    }

    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), owner);
    }

    function getMyRole() external view returns (Role) {
        if (msg.sender == owner) {
            return Role.Owner;
        } else if (managers[msg.sender]) {
            return Role.Manager;
        } else {
            return Role.Customer;
        }
    }

    function addTokenToWhiteList(
        address tokenAddress,
        string calldata tokenName
    ) external onlyOwner {
        require(!whiteListTokens[tokenAddress].isActive, "Token already added");
        whiteListTokens[tokenAddress] = TokenInfo(tokenName, true);
        emit TokenAdded(tokenAddress);
    }

    function removeToken(address token) external onlyManager {
        require(whiteListTokens[token].isActive, "Token not active");
        whiteListTokens[token].isActive = false;
        emit TokenRemoved(token);
    }

    function addManager(address manager) external onlyManager {
        require(!managers[manager], "Manager already added");
        managers[manager] = true;
        emit ManagerAdded(manager);
    }

    function removeManager(address manager) external onlyManager {
        require(managers[manager], "Manager not found");
        managers[manager] = false;
        emit ManagerRemoved(manager);
    }

    function deposit(
        address tokenAddress,
        address walletAddress,
        uint256 amount
    ) external nonReentrant validateToken(tokenAddress) {
        require(amount > 0, "Amount must be greater than zero");

        uint256 currentBalance = tokenBalanceByWallet[walletAddress][
            tokenAddress
        ];

        tokenBalanceByWallet[walletAddress][tokenAddress] = currentBalance.add(
            amount.sub(amount.mul(depositFeePercentage).div(100))
        );

        emit Deposit(walletAddress, tokenAddress, amount);

        require(
            IERC20(tokenAddress).transferFrom(
                msg.sender,
                address(this),
                amount
            ),
            "Transfer Failed"
        );
    }

    function withdrawFrom(
        address fromWalletAddress,
        address toWalletAddress,
        address tokenAddress,
        uint256 amount
    ) external nonReentrant validateToken(tokenAddress) onlyManager {
        require(whiteListTokens[tokenAddress].isActive, "Token is not active");
        require(amount > 0, "Amount must be greater than zero");

        uint256 currentBalance = tokenBalanceByWallet[fromWalletAddress][
            tokenAddress
        ];

        require(currentBalance >= amount, "Token amount not enough");

        tokenBalanceByWallet[fromWalletAddress][tokenAddress] = currentBalance
            .sub(amount);

        bool success = IERC20(tokenAddress).transfer(
            toWalletAddress,
            amount.sub(amount.mul(withdrawalFeePercentage).div(100))
        );
        emit Withdrawn(fromWalletAddress, tokenAddress, amount);
        require(success, "Transfer Failed");
    }

    // Tăng số dư của ví addressWallet (chỉ admin được phép)
    function increaseBalance(
        address walletAddress,
        address tokenAddress,
        uint256 amount
    ) external onlyManager {
        require(amount > 0, "Increase amount must be greater than zero");
        tokenBalanceByWallet[walletAddress][
            tokenAddress
        ] = tokenBalanceByWallet[walletAddress][tokenAddress].add(amount);
        emit BalanceIncreased(walletAddress, tokenAddress, amount);
    }

    // Giảm số dư của ví addressWallet (chỉ admin được phép)
    function decreaseBalance(
        address walletAddress,
        address tokenAddress,
        uint256 amount
    ) external onlyManager {
        require(amount > 0, "Decrease amount must be greater than zero");
        uint256 currentBalance = tokenBalanceByWallet[walletAddress][
            tokenAddress
        ];

        require(currentBalance >= amount, "Insufficient balance to decrease");
        tokenBalanceByWallet[walletAddress][tokenAddress] = currentBalance.sub(
            amount
        );

        emit BalanceDecreased(walletAddress, tokenAddress, amount);
    }

    function setFees(uint256 newDepositFee, uint256 newWithdrawalFee)
        external
        onlyOwner
    {
        if (newDepositFee != depositFeePercentage)
            depositFeePercentage = newDepositFee;
        if (newWithdrawalFee != withdrawalFeePercentage)
            withdrawalFeePercentage = newWithdrawalFee;
        emit FeesUpdated(newDepositFee, newWithdrawalFee);
    }

    function transferTokens(
        address tokenAddress,
        address recipient,
        uint256 amount
    ) external onlyOwner {
        require(amount > 0, "Amount must be greater than zero");
        require(
            IERC20(tokenAddress).balanceOf(address(this)) >= amount,
            "Insufficient contract balance"
        );

        bool success = IERC20(tokenAddress).transfer(recipient, amount);
        require(success, "Token transfer failed");
    }
}
