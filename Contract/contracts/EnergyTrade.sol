// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "./EnergyToken.sol";
import "./PriceConverter.sol";

// import "hardhat/console.sol";

contract EnergyTrade is Energy_Token, PriceConverter {
    /*************Global Variables************/

    /*-------Owner Variables-------------------------*/

    address[] public owners; //Array to store all the owners in the Network
    mapping(address => bool) public isOwner;
    uint256 public required; //Min Owners required for Approval
    uint256 public regFee; //Reg Fee set by the owner, to add prosumers in the Network
    address escrowAccount; //Address of the Deployed Smart Contract

    /*-----------------------------------------------------------------------------------------------*/

    /*-------Prosumer Variables-------------------------*/

    struct prosumer {
        uint256 _prosumerID;
        address _address;
        uint256 _aadharId; //12 digit
        bool _approved;
        uint256 _energyUnitPriceUSD;
        uint256 _energyUnitPriceMatic;
        uint256 _stakedEnergyBalance;
    }
    mapping(address => bool) public isProsumer;

    /* Created These Maps to optimise Gas */
    mapping(uint256 => address) public prosumerAddress;
    mapping(address => uint256) public prosumerID;

    prosumer[] public ApprovedProsumers;

    mapping(address => mapping(address => bool)) public approved; //address1 = unapprovedProsumer address, address2 = address Of Owner, bool
    mapping(address => mapping(address => bool)) public disapproved; //address1 = unapprovedProsumer address, address2 = address Of Owner, bool

    //--> Pending States before Approval

    prosumer[] public unApprovedProsumers;

    struct Txn {
        address _producer;
        address _consumer;
        uint256 _producerID;
        uint256 _consumerID;
        uint256 _consumerEnergyNeed;
        uint256 _producerUnitPrice; //MATIC
        uint256 _producerPaybleAmount;
    }

    Txn[] public Transaction;

    /*-----------------------------------------------------------------------------------------------*/

    /*-----------Transaction Variables----------------------------------------------*/

    /****************Constructor************/

    constructor(address[] memory _owners, uint _required) {
        //We will pass multiple owners & set a particular requirement number of apporvals needed

        require(_owners.length > 0, "Owners Required");
        require(_required > 0 && required <= _owners.length, "Invalid required number of owners");

        for (uint i; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "invalid owner");
            require(!isOwner[owner], "Owner is not unique");

            isOwner[owner] = true;
            owners.push(owner);
        }

        required = _required;
        escrowAccount = address(this);
    }

    /*-----------------------------------------------------------------------------------------------*/

    /********************ESCROW FUNCTIONS**********************************/

    //--> 1. Set Registration Fee

    function setRegFee(uint256 _regFee) public onlyOwner {
        regFee = _regFee;
    }

    //--> 2. Verify Details of Unapproved Prosumer

    //-->2.1 Internal Functions

    function _getApprovalCount(uint256 _unApprovedProsumerID) private view returns (uint256 count) {
        for (uint256 i = 0; i < owners.length; i++) {
            if (approved[unApprovedProsumers[_unApprovedProsumerID]._address][owners[i]]) {
                count++;
            }
        }
        return count;
    }

    function _getDisApprovalCount(
        uint256 _unApprovedProsumerID
    ) private view returns (uint256 count) {
        for (uint256 i = 0; i < owners.length; i++) {
            if (disapproved[unApprovedProsumers[_unApprovedProsumerID]._address][owners[i]]) {
                count += i;
            }
        }
        return count;
    }

    function deleteElementFrom_UnApprovedProsumers(
        uint256 _unApprovedProsumerID
    ) internal onlyOwner {
        require(
            _unApprovedProsumerID < unApprovedProsumers.length,
            "Invalid unapprovedProsumer Index"
        );

        for (uint256 i = _unApprovedProsumerID; i < unApprovedProsumers.length - 1; i++) {
            unApprovedProsumers[i] = unApprovedProsumers[i + 1];
        }
        unApprovedProsumers.pop();
    }

    /*-----------------------------------------------------------------------------------------------*/

    //-->2.2 Show all Approved or Unapproved Prosumer

    function show_Unapproved_Prosumers() public view onlyOwner returns (prosumer[] memory) {
        return unApprovedProsumers;
    }

    function show_Approved_Prosumers() public view returns (prosumer[] memory) {
        //Public Function anybody can call
        return ApprovedProsumers;
    }

    //-->2.3 Approval Status [Owner Specific]

    function showApprovalStatus_OwnerSpecific(
        address _unapprovedProsumerAddress
    ) public view onlyOwner returns (string memory) {
        if (approved[_unapprovedProsumerAddress][msg.sender]) {
            return ("Prosumer Approved");
        } else if (disapproved[_unapprovedProsumerAddress][msg.sender]) {
            return ("Prosumer Disapproved");
        } else {
            return ("Prosumer Not Approved Yet");
        }
    }

    //--> 2.4 Show UnApproved Prosumer [Owner Specific]

    function showUnapprovalList_OwnerSpecific() public view onlyOwner returns (prosumer[] memory) {
        prosumer[] memory pr = new prosumer[](unApprovedProsumers.length);
        for (uint256 i = 0; i < unApprovedProsumers.length; i++) {
            if (approved[unApprovedProsumers[i]._address][msg.sender] == false) {
                pr[i] = unApprovedProsumers[i];
            }
        }
        return pr;
    }

    //--> 2.5 Show Approved Prosumer [Owner Specific]

    function showApprovalList_OwnerSpecific() public view onlyOwner returns (prosumer[] memory) {
        prosumer[] memory pr = new prosumer[](unApprovedProsumers.length);
        for (uint256 i = 0; i < unApprovedProsumers.length; i++) {
            if (approved[unApprovedProsumers[i]._address][msg.sender] == true) {
                pr[i] = unApprovedProsumers[i];
            }
        }
        return pr;
    }

    /*
- Once Prosumer is Approved in the Network, you cannot remove him.
- Why? Because he has already gone through a verification process by multiple owners.
- Though the function can be implemented in Future, if we feel the need of it
*/

    //--> 3. Approve Prosumer

    function approveProsumer_OwnerSpecific(uint256 _unApprovedProsumerID) public onlyOwner {
        require(
            _unApprovedProsumerID < unApprovedProsumers.length,
            "Invalid Unapproved Prosumer ID"
        );
        require(
            approved[unApprovedProsumers[_unApprovedProsumerID]._address][msg.sender] == false,
            "Prosumer Already approved by you"
        );

        approved[unApprovedProsumers[_unApprovedProsumerID]._address][msg.sender] = true;

        //If disapproved earlier then wants to approve
        if (disapproved[unApprovedProsumers[_unApprovedProsumerID]._address][msg.sender]) {
            disapproved[unApprovedProsumers[_unApprovedProsumerID]._address][msg.sender] = false;
        }

        //check if approval > unapproval

        if (_getApprovalCount(_unApprovedProsumerID) >= required) {
            // console.log("I am adding the prosumer--- required it gets-",_getApprovalCount(_unApprovedProsumerID));
            //if yes then remove him from unapprove array and add him to approved prosumer array
            unApprovedProsumers[_unApprovedProsumerID]._approved = true; //Set approved Flag = true
            unApprovedProsumers[_unApprovedProsumerID]._prosumerID = ApprovedProsumers.length + 1; //Set Prosumer ID
            isProsumer[unApprovedProsumers[_unApprovedProsumerID]._address] = true;
            ApprovedProsumers.push(unApprovedProsumers[_unApprovedProsumerID]);
            deleteElementFrom_UnApprovedProsumers(_unApprovedProsumerID);

            /*Store the prosumers in the Maps*/
            prosumerAddress[ApprovedProsumers.length] = ApprovedProsumers[
                ApprovedProsumers.length - 1
            ]._address;
            prosumerID[ApprovedProsumers[ApprovedProsumers.length - 1]._address] = ApprovedProsumers
                .length;
        }
    }

    //--> 4. Disapprove Prosumer
    function DisApproveProsumer_OwnerSpecific(uint256 _unApprovedProsumerID) public onlyOwner {
        require(
            _unApprovedProsumerID < unApprovedProsumers.length,
            "Invalid Unapproved Prosumer ID"
        );
        require(
            disapproved[unApprovedProsumers[_unApprovedProsumerID]._address][msg.sender] == false,
            "Prosumer Already disapproved by you"
        );

        disapproved[unApprovedProsumers[_unApprovedProsumerID]._address][msg.sender] = true;

        //If approved earlier then disapprove
        if (disapproved[unApprovedProsumers[_unApprovedProsumerID]._address][msg.sender]) {
            approved[unApprovedProsumers[_unApprovedProsumerID]._address][msg.sender] = false;
        }

        if (_getDisApprovalCount(_unApprovedProsumerID) > required) {
            //if yes then remove him from unapprove array & don't store in approved array
            deleteElementFrom_UnApprovedProsumers(_unApprovedProsumerID);
        }
    }

    //-->5. Witdhraw Funds (Pending , send funds equally to all prosumer)  //Can only be called when Transaction array will be zero.
    function withdrawFees() public onlyOwner {
        require(Transaction.length == 0, "First process all Transaction"); //Otherwise all consumer money will be withdrawn to owners.
        uint256 euqiBalance = address(this).balance / owners.length;

        for (uint256 i = 0; i < owners.length; i++) {
            (bool callSuccess, ) = payable(owners[i]).call{value: euqiBalance}("");
            require(callSuccess, "Call Failed");
        }
    }

    //--> HIDDEN FUNCTION (Only created for easy demonstration of Project), Not reccomended in Production
    function removeProsumer() public onlyOwner {
        address lastProsumer = prosumerAddress[ApprovedProsumers.length];
        delete prosumerAddress[ApprovedProsumers.length];

        //Remove last element from ApprovedProsumers Array
        ApprovedProsumers.pop();

        delete prosumerID[lastProsumer];
    }

    //-->^^^^^^^^^^^^^^^^^^^^^^^^ Process Trade ^^^^^^^^^^^^^^^^^^^^
    function processTrade() public onlyOwner {
        //Designed to process multiple Trade with a single click
        require(Transaction.length != 0, "No pending Transaction to execute");
        for (uint256 i = 0; i < Transaction.length; i++) {
            _transfer(escrowAccount, Transaction[i]._consumer, Transaction[i]._consumerEnergyNeed);
            (bool callSuccess, ) = payable(Transaction[i]._producer).call{
                value: Transaction[i]._producerPaybleAmount
            }(""); //Transfering energy tokens to the producer
            require(callSuccess, "Call failed");
        }

        delete Transaction; //Empty the pending Transaction array after all the transaction processed
    }

    function viewEscrowBalance() public view returns (uint256, uint256) {
        return (address(this).balance, balanceOf(escrowAccount));
    }

    /********************PROSUMER FUNCTION**********************************/

    function isRequested() internal view returns (bool) {
        for (uint256 i = 0; i < unApprovedProsumers.length; i++) {
            if (msg.sender == unApprovedProsumers[i]._address) {
                return true;
            }
        }
        return false;
    }

    function req_Registration(uint256 _aadharNo) public payable {
        require(msg.value >= regFee, "Registration Failed, Insufficient Fee");
        require(!isProsumer[msg.sender], "You are already a Prosumer in the Network");
        require(!isRequested(), "You have already requested for Registration");

        uint256 digitCheck = _aadharNo;
        uint256 digits = 0;

        while (digitCheck != 0) {
            digitCheck /= 10;
            digits++;
        }

        require(digits == 12, "Enter a 12 digit Aadhar No.");

        //Create a prosumer object
        prosumer memory _prosumer = prosumer({
            _prosumerID: 0,
            _address: msg.sender,
            _aadharId: _aadharNo,
            _approved: false,
            _energyUnitPriceUSD: 0,
            _energyUnitPriceMatic: 0,
            _stakedEnergyBalance: 0
        });

        //Push the prosumer object to unApprovedProsumerArray
        unApprovedProsumers.push(_prosumer);
    }

    /*-------------------Producer--------------------------------------------------------------*/

    uint256 EnergyUnitPrice_usd;
    uint256 EnergyUnitPrice_matic;

    function setUnitPrice(uint256 price) internal onlyProsumer returns (uint256) {
        /* New Approach - Take Price input as 1e10 */

        EnergyUnitPrice_usd = price;
        uint256 latestMaticPrice = uint(getLatestPrice());
        // EnergyUnitPrice_matic = (price / latestMaticPrice) * 1e8;   (when we receive input as 1e18)
        EnergyUnitPrice_matic = (price / latestMaticPrice) * 1e16;
        /*------- 1e10/1e8 * 1e16 = 1e18 -----------------------*/
        return EnergyUnitPrice_matic;
    }

    function advert(
        uint256 unitEnergyPrice,
        uint256 excessEnergyToken
    ) public onlyProsumer returns (uint256) {
        transfer(escrowAccount, excessEnergyToken);

        uint256 ad_placerID = prosumerID[msg.sender];

        ApprovedProsumers[ad_placerID - 1]._energyUnitPriceUSD = unitEnergyPrice;
        ApprovedProsumers[ad_placerID - 1]._energyUnitPriceMatic = (setUnitPrice(unitEnergyPrice));
        ApprovedProsumers[ad_placerID - 1]._stakedEnergyBalance = excessEnergyToken;

        return ad_placerID;
    }

    function mySetUnitPrice_Matic() public view onlyProsumer returns (uint256) {
        return ApprovedProsumers[prosumerID[msg.sender] - 1]._energyUnitPriceMatic;
    }

    function mySetUnitPrice_USD() public view onlyProsumer returns (uint256) {
        return ApprovedProsumers[prosumerID[msg.sender] - 1]._energyUnitPriceUSD;
    }

    //mint  TODO:(Needs overriding, because now any user can access the default and mint function)
    function produceEnergy(uint256 energyProduced) public onlyProsumer {
        _mint(msg.sender, energyProduced);
    }

    //burn
    function burnEnergy(uint256 energyBurned) public onlyProsumer {
        _burn(msg.sender, energyBurned);
    }

    /*-------------------Consumer--------------------------------------------------------------*/

    function bid(uint256 producerID, uint256 energy_need) public payable onlyProsumer {
        uint256 MinPayableAmount = ApprovedProsumers[producerID - 1]._energyUnitPriceMatic *
            energy_need;
        require(msg.value >= MinPayableAmount, "Didn't send enough Matic!");
        require(
            energy_need <= ApprovedProsumers[producerID - 1]._stakedEnergyBalance,
            "Selected Producer do have enough Enough Energy Balance"
        );

        Txn memory _txn = Txn({
            _producer: prosumerAddress[producerID],
            _consumer: msg.sender,
            _producerID: producerID,
            _consumerID: prosumerID[msg.sender],
            _consumerEnergyNeed: energy_need,
            _producerUnitPrice: ApprovedProsumers[producerID - 1]._energyUnitPriceMatic,
            _producerPaybleAmount: MinPayableAmount
        });

        Transaction.push(_txn);

        ApprovedProsumers[producerID - 1]._stakedEnergyBalance =
            ApprovedProsumers[producerID - 1]._stakedEnergyBalance -
            energy_need;
    }

    function viewMaticBalance() public view returns (uint256) {
        return msg.sender.balance;
    }

    function viewEnergyBalance() public view returns (uint256) {
        return balanceOf(msg.sender);
    }

    /****************Modifiers************/

    modifier onlyOwner() {
        require(isOwner[msg.sender], "Not Owner");
        _;
    }

    modifier onlyProsumer() {
        require(isProsumer[msg.sender], "Not Prosumer");
        _;
    }
}
