// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.12;

// Import thirdweb contracts
import "@thirdweb-dev/contracts/drop/DropERC1155.sol"; // For my collection of weapon
import "@thirdweb-dev/contracts/token/TokenERC20.sol"; // For my ERC-20 Token contract
import "@thirdweb-dev/contracts/openzeppelin-presets/utils/ERC1155/ERC1155Holder.sol";

// OpenZeppelin (ReentrancyGuard)
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Fighting is ReentrancyGuard, ERC1155Holder {
    // Store our two other contracts here (Edition Drop and Token)
    DropERC1155 public immutable weaponNftCollection;
    TokenERC20 public immutable rewardsToken;

    // Constructor function to set the rewards token and the NFT collection addresses
    constructor(
        DropERC1155 weaponContractAddress,
        TokenERC20 soulsContractAddress
    ) {
        weaponNftCollection = weaponContractAddress;
        rewardsToken = soulsContractAddress;
    }

    struct MapValue {
        bool isData;
        uint256 value;
    }

    mapping(address => MapValue) public playerWeapon;

    mapping(address => MapValue) public playerLastUpdate;

    function stake(uint256 _tokenId) external nonReentrant {
        // Ensure the player has at least 1 of the token they are trying to stake
        require(
            weaponNftCollection.balanceOf(msg.sender, _tokenId) >= 1,
            "You must have at least 1 of the weapon you are trying to stake"
        );

        // If they have a weapon already, send it back to them.
        if (playerWeapon[msg.sender].isData) {
            // Transfer using safeTransfer
            weaponNftCollection.safeTransferFrom(
                address(this),
                msg.sender,
                playerWeapon[msg.sender].value,
                1,
                "Returning your old weapon"
            );
        }

        // Calculate the rewards they are owed, and pay them out.
        uint256 reward = calculateRewards(msg.sender);
        rewardsToken.transfer(msg.sender, reward);

        // Transfer the weapon to the contract
        weaponNftCollection.safeTransferFrom(
            msg.sender,
            address(this),
            _tokenId,
            1,
            "Staking your weapon"
        );

        // Update the playerWeapon mapping
        playerWeapon[msg.sender].value = _tokenId;
        playerWeapon[msg.sender].isData = true;

        // Update the playerLastUpdate mapping
        playerLastUpdate[msg.sender].isData = true;
        playerLastUpdate[msg.sender].value = block.timestamp;
    }

    function withdraw() external nonReentrant {
        // Ensure the player has a weapon
        require(
            playerWeapon[msg.sender].isData,
            "You do not have a weapon to withdraw."
        );

        // Calculate the rewards they are owed, and pay them out.
        uint256 reward = calculateRewards(msg.sender);
        rewardsToken.transfer(msg.sender, reward);

        // Send the weapon back to the player
        weaponNftCollection.safeTransferFrom(
            address(this),
            msg.sender,
            playerWeapon[msg.sender].value,
            1,
            "Returning your old weapon"
        );

        // Update the playerWeapon mapping
        playerWeapon[msg.sender].isData = false;

        // Update the playerLastUpdate mapping
        playerLastUpdate[msg.sender].isData = true;
        playerLastUpdate[msg.sender].value = block.timestamp;
    }

    function claim() external nonReentrant {
        // Calculate the rewards they are owed, and pay them out.
        uint256 reward = calculateRewards(msg.sender);
        rewardsToken.transfer(msg.sender, reward);

        // Update the playerLastUpdate mapping
        playerLastUpdate[msg.sender].isData = true;
        playerLastUpdate[msg.sender].value = block.timestamp;
    }

    function calculateRewards(
        address _player
    ) public view returns (uint256 _rewards) {
        // If playerLastUpdate or playerWeapon is not set, then the player has no rewards.
        if (
            !playerLastUpdate[_player].isData || !playerWeapon[_player].isData
        ) {
            return 0;
        }

        // Calculate the time difference between now and the last time they staked/withdrew/claimed their rewards
        uint256 timeDifference = block.timestamp -
            playerLastUpdate[_player].value;

        // Calculate the rewards they are owed
        uint256 rewards = timeDifference *
            10_000_000_000_000 *
            (playerWeapon[_player].value + 1);

        // Return the rewards
        return rewards;
    }
}
