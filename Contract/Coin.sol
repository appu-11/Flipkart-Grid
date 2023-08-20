 
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Sikka {
    address public admin;
    string public name = "Sikka";

    struct User {
        uint256 balance;
        uint256 lastPurchaseTimestamp;
    }

    address[] public usersArray;
    mapping(address => bool) public userExists;
    mapping(address => User) public users;
    uint256 public decayRate = 1;
    uint256 public decayInterval = 4 weeks;

    event transferhist(address indexed from, address indexed to, uint256 value, uint256 timestamp);
    event history(address indexed user, uint256 value, string task, uint256 timestamp);
    event PurchasedTokens(address indexed user, uint256 value, uint256 timestamp);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor(){
        admin = msg.sender;
    }

    function decayCoins() external onlyAdmin {
        for (uint256 i = 0; i < usersArray.length; i++) {
            address userAddress = usersArray[i];
            if (users[userAddress].balance > 0 && block.timestamp >= (users[userAddress].lastPurchaseTimestamp + decayInterval)) {
                if(users[userAddress].balance <= 10) {
                    users[userAddress].balance = 0;
                }
                else{
                    users[userAddress].balance -= 10;
                }
            }
        }
    }

    function purchaseTokens(uint256 _amount) external {
        require(_amount > 0, "Purchase amount must be greater than 0");
        require(msg.sender != address(0));
        require(users[msg.sender].balance + _amount <= 100000, "Wallet Limit Exceeding");
        users[msg.sender].balance += _amount;
        users[msg.sender].lastPurchaseTimestamp = block.timestamp;
        if(userExists[msg.sender] == false) {
            userExists[msg.sender] = true;
            usersArray.push(msg.sender);
        }
        emit PurchasedTokens(msg.sender, _amount, block.timestamp);
    }

    function balanceOf() public view returns (uint256) {
        return users[msg.sender].balance;
    }

    function registerSeller() external returns (bool success) {
        require(msg.sender != address(0), "Invalid recipient");
        require(users[msg.sender].balance + 200 <= 100000, "Wallet limit Exceeding");
        users[msg.sender].balance += 200;
        users[msg.sender].lastPurchaseTimestamp = block.timestamp;
        if(userExists[msg.sender] == false) {
            userExists[msg.sender] = true;
            usersArray.push(msg.sender);
        }
        emit history(msg.sender, users[msg.sender].balance, "Registration Bonus", block.timestamp);
        return true;
    }

    function registerUser() external returns (bool success) {
        require(msg.sender != address(0), "Invalid recipient");
        require(users[msg.sender].balance + 200 <= 5000, "Wallet limit Exceeding");
        users[msg.sender].balance += 200;
        users[msg.sender].lastPurchaseTimestamp = block.timestamp;
        if(userExists[msg.sender] == false) {
            userExists[msg.sender] = true;
            usersArray.push(msg.sender);
        }
        emit history(msg.sender, users[msg.sender].balance, "Registration Bonus", block.timestamp);
        return true;
    }

    function redeem(uint256 value) external returns (bool success) {
        require(msg.sender != address(0), "Invalid recipient");
        require(users[msg.sender].balance >= value, "Insufficient Balance");
        users[msg.sender].balance -= value;
        users[msg.sender].lastPurchaseTimestamp = block.timestamp;
        if(userExists[msg.sender] == false) {
            userExists[msg.sender] = true;
            usersArray.push(msg.sender);
        }
        emit history(msg.sender, value, "Redeemed Sikke", block.timestamp);
        return true;
    }

    function earn(uint256 value) external returns (bool success) {
        require(msg.sender != address(0), "Invalid recipient");
        users[msg.sender].balance += value;
        if(userExists[msg.sender] == false) {
            userExists[msg.sender] = true;
            usersArray.push(msg.sender);
        }
        emit history(msg.sender, value, "Earned Sikke", block.timestamp);
        return true;
    }

    function Transfer(address _to, uint256 _value) external returns (bool success) {
        require(_to != address(0), "Invalid recipient");
        require(msg.sender != address(0), "Invalid sender");
        require(_value > 0, "Amount must be greater than 0");
        require(users[msg.sender].balance >= _value, "Insufficient Balance");
        require(users[_to].balance + _value <= 5000, "Recipient Wallet Limit Exceeding");
        users[msg.sender].balance -= _value;
        users[_to].balance += _value;
        if(userExists[msg.sender] == false) {
            userExists[msg.sender] = true;
            usersArray.push(msg.sender);
        }
        if(userExists[_to] == false) {
            userExists[_to] = true;
            usersArray.push(_to);
        }
        emit transferhist(msg.sender, _to, _value, block.timestamp);
        emit history(_to, _value, "Recieved a Gift", block.timestamp);
        return true;
    }
}
