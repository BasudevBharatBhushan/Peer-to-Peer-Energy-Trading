// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "./EnergyToken.sol";
import "./PriceConverter.sol";
import "./MultiSig.sol";

contract EnergyTrade is Energy_Token, PriceConverter, MultiSig {
    /*************Global Variables************/

    address escrowAccount; //Address of the Deployed Smart Contract
    uint256 EnergyUnitPrice_usd;
    uint256 EnergyUnitPrice_matic;

    /****************Constructor************/

    constructor(
        address forwarder,
        address[] memory _owners,
        uint256 _required
    ) MultiSig(forwarder, _owners, _required) {
        escrowAccount = address(this);
    }

    /****************Events**************************************/

    event EnergyListed(
        uint256 indexed sellerID,
        uint256 unitEnergyPriceUSD,
        uint256 unitEnergyPriceMatic,
        uint256 listedEnergyToken
    );

    event EnergyBought(
        uint256 indexed sellerID,
        uint256 indexed buyerID,
        uint256 indexed unitEnergyPriceUSD,
        uint256 unitEnergyPriceMatic,
        uint256 boughtEnergyToken
    );

    //Overriden GSN functions to resolve naming conflicts

    function _msgSender() internal view override(Context, ERC2771Recipient) returns (address) {
        return ERC2771Recipient._msgSender();
    }

    function _msgData() internal view override(Context, ERC2771Recipient) returns (bytes calldata) {
        return ERC2771Recipient._msgData();
    }

    /***************General View Functions***********************/

    function viewEscrowBalance() public view returns (uint256, uint256) {
        return (address(this).balance, balanceOf(escrowAccount));
    }

    function viewMaticBalance() public view returns (uint256) {
        return msg.sender.balance;
    }

    function viewEnergyBalance() public view returns (uint256) {
        return balanceOf(msg.sender);
    }

    /********************TRADING FUNCTION FOR PROSUMERS**********************************/

    /*-------------------Producer--------------------------------------------------------------*/

    //--> 1. Set Energy Unit Price for 1 Unit of Energy
    function setUnitPrice(uint256 price) private onlyProsumer returns (uint256) {
        /* Take Price input as 1e16 */

        EnergyUnitPrice_usd = price;
        uint256 latestMaticPrice = uint(getLatestPrice());
        EnergyUnitPrice_matic = (price / latestMaticPrice) * 1e10;
        /*------- 1e16/1e8 * 1e10 = 1e18 ----- ------------------*/

        return EnergyUnitPrice_matic;
    }

    //--> 2. List Energy for Sale
    function listEnergy(
        uint256 unitEnergyPrice,
        uint256 excessEnergyToken
    ) public onlyProsumer isNotSuspended returns (uint256) {
        require(
            ApprovedProsumers[prosumerID[msg.sender] - 1]._stakedEnergyBalance == 0,
            "You have Already Staked Energy"
        );

        uint256 ad_placerID = prosumerID[msg.sender];

        ApprovedProsumers[ad_placerID - 1]._energyUnitPriceUSD = unitEnergyPrice;
        ApprovedProsumers[ad_placerID - 1]._energyUnitPriceMatic = (setUnitPrice(unitEnergyPrice));
        ApprovedProsumers[ad_placerID - 1]._stakedEnergyBalance = excessEnergyToken;

        transfer(escrowAccount, excessEnergyToken);

        emit EnergyListed(
            ad_placerID,
            ApprovedProsumers[ad_placerID - 1]._energyUnitPriceUSD,
            ApprovedProsumers[ad_placerID - 1]._energyUnitPriceMatic,
            excessEnergyToken
        );

        return ad_placerID;
    }

    //--> 3. Set Unit Price for 1 Unit of Energy in Matic
    function mySetUnitPrice_Matic() public view onlyProsumer returns (uint256) {
        return ApprovedProsumers[prosumerID[msg.sender] - 1]._energyUnitPriceMatic;
    }

    //--> 4. Set Unit Price for 1 Unit of Energy in USD
    function mySetUnitPrice_USD() public view onlyProsumer returns (uint256) {
        return ApprovedProsumers[prosumerID[msg.sender] - 1]._energyUnitPriceUSD;
    }

    //--> 5. Mint Energy Token
    function produceEnergy(uint256 energyProduced) public onlyProsumer isNotSuspended {
        _mint(msg.sender, energyProduced);
    }

    //--> 6. Burn Energy Token
    function burnEnergy(uint256 energyBurned) public onlyProsumer isNotSuspended {
        _burn(msg.sender, energyBurned);
    }

    /*-------------------Consumer--------------------------------------------------------------*/

    //--> 1. Buy Energy
    function buyEnergy(
        uint256 producerID,
        uint256 energy_need
    ) public payable onlyProsumer isNotSuspended {
        uint256 MinPayableAmount = ApprovedProsumers[producerID - 1]._energyUnitPriceMatic *
            energy_need;
        require(msg.value >= MinPayableAmount, "Didn't send enough Matic!");
        require(
            energy_need <= ApprovedProsumers[producerID - 1]._stakedEnergyBalance,
            "Selected Producer do have enough Enough Energy Balance"
        );

        // State Change Before Transfer to avoid Re-entrancy Attack
        ApprovedProsumers[producerID - 1]._stakedEnergyBalance =
            ApprovedProsumers[producerID - 1]._stakedEnergyBalance -
            energy_need;

        //Transfer Energy to Consumer
        _transfer(escrowAccount, msg.sender, energy_need);

        //Transfer Matic to Producer
        (bool callSuccess, ) = payable(prosumerAddress[producerID]).call{value: MinPayableAmount}(
            ""
        );

        require(callSuccess, "call failed");

        emit EnergyBought(
            producerID,
            prosumerID[msg.sender],
            ApprovedProsumers[producerID - 1]._energyUnitPriceUSD,
            ApprovedProsumers[producerID - 1]._energyUnitPriceMatic,
            energy_need
        );
    }

    /****************Modifiers************/

    modifier onlyProsumer() {
        require(isProsumer[msg.sender], "Not Prosumer");
        _;
    }

    modifier isNotSuspended() {
        require(!ApprovedProsumers[prosumerID[msg.sender] - 1]._suspended, "You are Suspended");
        _;
    }
}
