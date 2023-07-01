// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.7;
import "@opengsn/contracts/src/ERC2771Recipient.sol";

//GSN ENABLED CONTRACT

contract MultiSig is ERC2771Recipient {
    /*************Global Variables************/

    uint256 public required;
    uint256 public regFee;

    address[] public owners;

    mapping(address => bool) public isOwner;
    mapping(address => mapping(address => bool)) public approved; //address1 = unapprovedProsumer address, address2 = address Of Owner, bool
    mapping(address => mapping(address => bool)) public disapproved; //address1 = unapprovedProsumer address, address2 = address Of Owner, bool
    mapping(address => mapping(address => bool)) public suspended; //address1 = unapprovedProsumer address, address2 = address Of Owner, bool
    mapping(address => mapping(address => bool)) public unSuspended; //address1 = unapprovedProsumer address, address2 = address Of Owner, bool

    /*-------Prosumer Variables-------------------------*/
    struct prosumer {
        uint256 _prosumerID;
        address _address;
        uint256 _aadharId;
        bool _approved;
        bool _suspended;
        uint256 _energyUnitPriceUSD;
        uint256 _energyUnitPriceMatic;
        uint256 _stakedEnergyBalance;
    }

    prosumer[] public ApprovedProsumers;
    prosumer[] public unApprovedProsumers;

    mapping(address => bool) public isProsumer;
    mapping(uint256 => address) public prosumerAddress;
    mapping(address => uint256) public prosumerID;

    //Prosumer Stats
    mapping(address => uint256) public approvalCount;
    mapping(address => uint256) public disapprovalCount;
    mapping(address => uint256) public suspensionCount;
    mapping(address => uint256) public unSuspensionCount;

    /****************Complain**************************************/
    struct Complain {
        uint256 _complainID;
        uint256 _complainant;
        uint256 _accused;
        string _complain;
        bool _resolved;
    }

    uint256 public complainCount;
    uint256 public maxComplains = 10;
    Complain[] public complains;

    /****************Constructor************/
    constructor(address forwarder, address[] memory _owners, uint _required) {
        //Set the trusted forwarder
        _setTrustedForwarder(forwarder);

        //We will pass multiple owners & set a particular requirement number of apporvals needed
        require(_owners.length > 0, "Owners Required");
        require(_required > 0 && _required <= _owners.length, "Invalid required number of owners");

        for (uint i; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "invalid owner");
            require(!isOwner[owner], "Owner is not unique");

            isOwner[owner] = true;
            owners.push(owner);
        }

        required = _required;
    }

    string public versionRecipient = "3.0.0";

    // Request for Registration as Prosumer

    /**Unverified User Function***/

    //Internal Function
    function isRequested() private view returns (bool) {
        for (uint256 i = 0; i < unApprovedProsumers.length; i++) {
            if (msg.sender == unApprovedProsumers[i]._address) {
                return true;
            }
        }
        return false;
    }

    //-->1. Register as Prosumer
    function req_Registration(uint256 _aadharNo) public payable {
        require(!isOwner[msg.sender], "You are an Owner");
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
            _suspended: false,
            _energyUnitPriceUSD: 0,
            _energyUnitPriceMatic: 0,
            _stakedEnergyBalance: 0
        });

        //Push the prosumer object to unApprovedProsumerArray
        unApprovedProsumers.push(_prosumer);
    }

    function raiseComplain(uint256 _prosumerId, string memory _complainBody) public {
        require(isProsumer[_msgSender()], "You not a Prosumer");
        require(isProsumer[prosumerAddress[_prosumerId]], "Accused not a Prosumer");
        require(
            !suspended[prosumerAddress[_prosumerId]][_msgSender()],
            "Accused Prosumer is Suspended"
        );
        require(!suspended[_msgSender()][prosumerAddress[_prosumerId]], "You are Suspended");
        require(
            !disapproved[prosumerAddress[_prosumerId]][_msgSender()],
            "Prosumer is Disapproved"
        );
        require(!disapproved[_msgSender()][prosumerAddress[_prosumerId]], "You are Disapproved");

        Complain memory _complain = Complain({
            _complainID: complains.length + 1,
            _complainant: prosumerID[_msgSender()],
            _accused: _prosumerId,
            _complain: _complainBody,
            _resolved: false
        });

        if (complains.length < maxComplains) {
            complains.push(_complain);
        } else {
            complains[complainCount % maxComplains] = _complain;
        }

        if (complainCount < maxComplains) {
            complainCount++;
        }
    }

    /***************Owner Functions***********************/

    //--> 1. Set Registration Fee

    function setRegFee(uint256 _regFee) public onlyOwner {
        regFee = _regFee;
    }

    //--> 2. Verify Details of Unapproved Prosumer

    //-->2.1 Internal Function

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
        if (approved[_unapprovedProsumerAddress][_msgSender()]) {
            return ("Prosumer Approved");
        } else if (disapproved[_unapprovedProsumerAddress][_msgSender()]) {
            return ("Prosumer Disapproved");
        } else {
            return ("Prosumer Not Verified Yet");
        }
    }

    /*** Admission of Prosumer ***/

    //--> 3. Approve Prosumer

    function approveProsumer_OwnerSpecific(uint256 _unApprovedProsumerID) public onlyOwner {
        require(
            _unApprovedProsumerID < unApprovedProsumers.length,
            "Invalid Unapproved Prosumer ID"
        );
        require(
            approved[unApprovedProsumers[_unApprovedProsumerID]._address][_msgSender()] == false,
            "Prosumer Already approved by you"
        );

        approved[unApprovedProsumers[_unApprovedProsumerID]._address][_msgSender()] = true;

        //If disapproved earlier then wants to approve
        if (disapproved[unApprovedProsumers[_unApprovedProsumerID]._address][_msgSender()]) {
            disapproved[unApprovedProsumers[_unApprovedProsumerID]._address][_msgSender()] = false;
            disapprovalCount[unApprovedProsumers[_unApprovedProsumerID]._address]--;
        }

        approvalCount[unApprovedProsumers[_unApprovedProsumerID]._address]++;

        uint256 getApprovalCount = approvalCount[
            unApprovedProsumers[_unApprovedProsumerID]._address
        ];

        //check if approval > required
        if (getApprovalCount > required) {
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
            disapproved[unApprovedProsumers[_unApprovedProsumerID]._address][_msgSender()] == false,
            "Prosumer Already disapproved by you"
        );

        disapproved[unApprovedProsumers[_unApprovedProsumerID]._address][_msgSender()] = true;

        //If approved earlier then disapprove
        if (disapproved[unApprovedProsumers[_unApprovedProsumerID]._address][_msgSender()]) {
            approved[unApprovedProsumers[_unApprovedProsumerID]._address][_msgSender()] = false;
            approvalCount[unApprovedProsumers[_unApprovedProsumerID]._address]--;
        }

        disapprovalCount[unApprovedProsumers[_unApprovedProsumerID]._address]++;

        uint256 getDisApprovalCount = disapprovalCount[
            unApprovedProsumers[_unApprovedProsumerID]._address
        ];

        //check if disapproval > required
        if (getDisApprovalCount > required) {
            //if yes then remove him from unapprove array & don't store in approved array
            deleteElementFrom_UnApprovedProsumers(_unApprovedProsumerID);
            delete disapprovalCount[unApprovedProsumers[_unApprovedProsumerID]._address];
            delete approvalCount[unApprovedProsumers[_unApprovedProsumerID]._address];
        }
    }

    /*** Suspension of Prosumer ***/

    //--> 5. Suspend Prosumer
    function suspendProsumer(uint256 _prosumerId, uint256 _complainId) public onlyOwner {
        address getProsumerAddress = prosumerAddress[_prosumerId];
        require(isProsumer[getProsumerAddress], "Not a Prosumer");
        require(!suspended[getProsumerAddress][_msgSender()], "Already Suspended");

        suspended[getProsumerAddress][_msgSender()] = true;

        //If unsuspended earlier then suspend
        if (unSuspended[getProsumerAddress][_msgSender()]) {
            unSuspended[getProsumerAddress][_msgSender()] = false;
            unSuspensionCount[getProsumerAddress]--;
        }

        uint256 getSuspensionCount = suspensionCount[getProsumerAddress]++;

        //check if suspension > required
        if (getSuspensionCount > required) {
            //if yes then remove him from unapprove array & don't store in approved array
            delete suspensionCount[getProsumerAddress];
            ApprovedProsumers[_prosumerId - 1]._suspended = true;
            complains[_complainId - 1]._resolved = true;
        }
    }

    //--> 6. Unsuspend Prosumer
    function unSuspendProsumer(uint256 _prosumerId, uint256 _complainId) public onlyOwner {
        require(isProsumer[prosumerAddress[_prosumerId]], "Not a Prosumer");
        require(!unSuspended[prosumerAddress[_prosumerId]][_msgSender()], "Already Unsuspended");

        address prosumerToUnsuspend = prosumerAddress[_prosumerId];

        unSuspended[prosumerToUnsuspend][_msgSender()] = true;

        // If suspended earlier then unsuspend
        if (suspended[prosumerToUnsuspend][_msgSender()]) {
            suspended[prosumerToUnsuspend][_msgSender()] = false;
            suspensionCount[prosumerToUnsuspend]--;
        }

        uint256 getUnSuspensionCount = unSuspensionCount[prosumerToUnsuspend]++;

        // Check if unsuspension > required
        if (getUnSuspensionCount > required) {
            // If yes, then remove him from unapprove array & don't store in the approved array
            delete unSuspensionCount[prosumerToUnsuspend];
            delete suspensionCount[prosumerToUnsuspend];
            ApprovedProsumers[_prosumerId - 1]._suspended = false;
            complains[_complainId - 1]._resolved = true;
        }
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
            if (owners[i] == _msgSender()) {
                owners[i] = newOwner;
                break;
            }
        }
    }

    modifier onlyOwner() {
        require(isOwner[_msgSender()], "Not Owner");
        _;
    }
}
