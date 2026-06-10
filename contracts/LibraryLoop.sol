// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LibraryLoop {
    mapping(address => uint256) public userShelves;
    mapping(address => uint256) public userCards;
    mapping(address => uint256) public userBells;

    uint256 public totalShelves;
    uint256 public totalCards;
    uint256 public totalBells;

    event BookShelved(address indexed user, uint256 userShelves, uint256 totalShelves);
    event CardStamped(address indexed user, uint256 userCards, uint256 totalCards);
    event BellQuieted(address indexed user, uint256 userBells, uint256 totalBells);

    function shelveBook() external {
        unchecked {
            userShelves[msg.sender] += 1;
            totalShelves += 1;
        }

        emit BookShelved(msg.sender, userShelves[msg.sender], totalShelves);
    }

    function stampCard() external {
        unchecked {
            userCards[msg.sender] += 1;
            totalCards += 1;
        }

        emit CardStamped(msg.sender, userCards[msg.sender], totalCards);
    }

    function quietBell() external {
        unchecked {
            userBells[msg.sender] += 1;
            totalBells += 1;
        }

        emit BellQuieted(msg.sender, userBells[msg.sender], totalBells);
    }
}

