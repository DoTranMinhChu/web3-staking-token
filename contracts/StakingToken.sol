// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract StakingToken is ReentrancyGuard {
    using SafeMath for uint256;
    address private owner;
    struct TokenInfo {
        string tokenName;
        bool isActive;
    }

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    uint256 public REWARD_RATE = 1e18;
    event RewardRateUpdated(uint256 newRewardRate);
    mapping(address => TokenInfo) public whiteListTokens;
    address[] public whiteListTokenAddresses;
    mapping(address => mapping(address => uint256)) public stakedBalance;
    mapping(address => mapping(address => uint256)) public rewards;
    mapping(address => mapping(address => uint256))
        public userRewardPerTokenPaid;
    mapping(address => uint256) public rewardPerTokenStored;
    mapping(address => uint256) public lastUpdateTime;
    mapping(address => uint256) public totalStakedTokens;

    event Staked(
        address indexed user,
        address indexed addressToken,
        uint256 indexed amount
    );
    event Withdrawn(address indexed user, uint256 indexed amount);
    event RewardsClaimed(address indexed user, uint256 indexed amount);
    event TokenAdded(address indexed addressToken);
    event TokenRemoved(address indexed addressToken);
    event Withdrawn(
        address indexed user,
        address indexed addressToken,
        uint256 indexed amount
    );
    event RewardsClaimed(
        address indexed user,
        address indexed addressToken,
        uint256 indexed amount
    );
    event ManagerRemoved(address indexed manager);
    event ManagerAdded(address indexed manager);
    event TokensTransferred(
        address indexed token,
        address indexed to,
        uint256 amount
    );
    mapping(address => bool) private managers;

    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), owner);
    }

    enum Role {
        None,
        Owner,
        Manager
    }

    function getMyRole() external view returns (Role) {
        if (msg.sender == owner) {
            return Role.Owner;
        } else if (managers[msg.sender]) {
            return Role.Manager;
        } else {
            return Role.None;
        }
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }
    modifier onlyManager() {
        require(managers[msg.sender] || owner == msg.sender, "Not authorized");
        _;
    }

    function addTokenToWhiteList(
        address tokenAddress,
        string calldata tokenName
    ) external onlyOwner {
        require(!whiteListTokens[tokenAddress].isActive, "Token already added");
        whiteListTokens[tokenAddress] = TokenInfo(tokenName, true);
        whiteListTokenAddresses.push(tokenAddress);
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

    function rewardPerToken(address token) public view returns (uint256) {
        require(whiteListTokens[token].isActive, "Token is not active");
        if (totalStakedTokens[token] == 0) {
            return rewardPerTokenStored[token];
        }
        uint256 totalTime = block.timestamp.sub(lastUpdateTime[token]);
        uint256 totalRewards = REWARD_RATE.mul(totalTime);
        return
            rewardPerTokenStored[token].add(
                totalRewards.mul(1e18).div(totalStakedTokens[token])
            );
    }

    function earned(address token, address account)
        public
        view
        returns (uint256)
    {
        require(whiteListTokens[token].isActive, "Token is not active");
        return
            stakedBalance[token][account]
                .mul(
                    rewardPerToken(token).sub(
                        userRewardPerTokenPaid[token][account]
                    )
                )
                .div(1e18)
                .add(rewards[token][account]);
    }

    modifier updateReward(address token, address account) {
        require(whiteListTokens[token].isActive, "Token is not active");
        rewardPerTokenStored[token] = rewardPerToken(token);
        lastUpdateTime[token] = block.timestamp;
        rewards[token][account] = earned(token, account);
        userRewardPerTokenPaid[token][account] = rewardPerTokenStored[token];
        _;
    }

    function stake(address token, uint256 amount)
        external
        nonReentrant
        updateReward(token, msg.sender)
    {
        require(whiteListTokens[token].isActive, "Token is not active");
        require(amount > 0, "Amount must be greater than zero");
        totalStakedTokens[token] = totalStakedTokens[token].add(amount);
        stakedBalance[token][msg.sender] = stakedBalance[token][msg.sender].add(
            amount
        );
        emit Staked(msg.sender, token, amount);
        bool success = IERC20(token).transferFrom(
            msg.sender,
            address(this),
            amount
        );
        require(success, "Transfer Failed");
    }

    function setRewardRate(uint256 newRewardRate) external onlyManager {
        REWARD_RATE = newRewardRate;
        emit RewardRateUpdated(newRewardRate);
    }

    function withdrawStakedTokens(address token, uint256 amount)
        external
        nonReentrant
        updateReward(token, msg.sender)
    {
        require(whiteListTokens[token].isActive, "Token is not active");
        require(amount > 0, "Amount must be greater than zero");
        require(
            stakedBalance[token][msg.sender] >= amount,
            "Staked amount not enough"
        );
        totalStakedTokens[token] = totalStakedTokens[token].sub(amount);
        stakedBalance[token][msg.sender] = stakedBalance[token][msg.sender].sub(
            amount
        );
        emit Withdrawn(msg.sender, token, amount);
        bool success = IERC20(token).transfer(msg.sender, amount);
        require(success, "Transfer Failed");
    }

    function getReward(address token)
        external
        nonReentrant
        updateReward(token, msg.sender)
    {
        require(whiteListTokens[token].isActive, "Token is not active");
        uint256 reward = rewards[token][msg.sender];
        require(reward > 0, "No rewards to claim");
        rewards[token][msg.sender] = 0;
        emit RewardsClaimed(msg.sender, token, reward);
        bool success = IERC20(token).transfer(msg.sender, reward);
        require(success, "Transfer Failed");
    }

    function transferTokens(
        address token,
        address to,
        uint256 amount
    ) external onlyManager {
        require(whiteListTokens[token].isActive, "Token is not active");
        require(amount > 0, "Amount must be greater than zero");
        bool success = IERC20(token).transfer(to, amount);
        require(success, "Transfer Failed");
        emit TokensTransferred(token, to, amount);
    }

    function getStakedBalanceTokenByAccount(address token, address account)
        external
        view
        onlyManager
        returns (uint256)
    {
        require(whiteListTokens[token].isActive, "Token is not active");
        return stakedBalance[token][account];
    }

    function getMyStakedBalance(address token) external view returns (uint256) {
        require(whiteListTokens[token].isActive, "Token is not active");
        return stakedBalance[token][msg.sender];
    }
}
