// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.7;

contract MultiSig {
    /*************Global Variables************/

    uint256 public required;
    uint256 public regFee;

    address[] public owners;

    mapping(address => bool) public isOwner;
    mapping(address => mapping(address => bool)) public approved; //address1 = unapprovedProsumer address, address2 = address Of Owner, bool
    mapping(address => mapping(address => bool)) public disapproved; //address1 = unapprovedProsumer address, address2 = address Of Owner, bool

    /*-------Prosumer Variables-------------------------*/
    struct prosumer {
        uint256 _prosumerID;
        address _address;
        uint256 _aadharId;
        bool _approved;
        uint256 _energyUnitPriceUSD;
        uint256 _energyUnitPriceMatic;
        uint256 _stakedEnergyBalance;
    }

    prosumer[] public ApprovedProsumers;
    prosumer[] public unApprovedProsumers;

    mapping(address => bool) public isProsumer;
    mapping(uint256 => address) public prosumerAddress;
    mapping(address => uint256) public prosumerID;

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
    }

    /***************Owner Functions***********************/

    //--> 1. Set Registration Fee

    function setRegFee(uint256 _regFee) public onlyOwner {
        regFee = _regFee;
    }

    //--> 2. Verify Details of Unapproved Prosumer

    //-->2.1 Internal Functions

    //-->2.1.1
    function _getApprovalCount(uint256 _unApprovedProsumerID) private view returns (uint256 count) {
        for (uint256 i = 0; i < owners.length; i++) {
            if (approved[unApprovedProsumers[_unApprovedProsumerID]._address][owners[i]]) {
                count++;
            }
        }
        return count;
    }

    //-->2.1.2
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

    //-->2.1.3
    function deleteElementFrom_UnApprovedProsumers(
        uint256 _unApprovedProsumerID
    ) private onlyOwner {
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
            return ("Prosumer Not Verified Yet");
        }
    }

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

    //->5. Request for Registration as Prosumer

    //-->5.1 Internal Function
    function isRequested() private view returns (bool) {
        for (uint256 i = 0; i < unApprovedProsumers.length; i++) {
            if (msg.sender == unApprovedProsumers[i]._address) {
                return true;
            }
        }
        return false;
    }

    //-->6.2 Register as Prosumer
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

    //-->6.3. Witdhraw Funds (Pending , send funds equally to all prosumer)  //Can only be called when Transaction array will be zero.
    function withdrawFees() public onlyOwner {
        uint256 euqiBalance = address(this).balance / owners.length;

        for (uint256 i = 0; i < owners.length; i++) {
            (bool callSuccess, ) = payable(owners[i]).call{value: euqiBalance}("");
            require(callSuccess, "Call Failed");
        }
    }

    //6.4. Transfer Ownership
    function transferOwnership(address newOwner) public onlyOwner {
        for (uint256 i = 0; i < owners.length; i++) {
            if (owners[i] == msg.sender) {
                owners[i] = newOwner;
                break;
            }
        }
    }

    modifier onlyOwner() {
        require(isOwner[msg.sender], "Not Owner");
        _;
    }
}
