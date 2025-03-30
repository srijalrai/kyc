pragma experimental ABIEncoderV2;
pragma solidity >=0.4.21 <0.7.0;

struct BankInfo {
    string b_name;
    address bankAddress;
}

interface KYC_Functions {
    enum Status {
        Accepted,
        Rejected,
        Pending
    }
    function isOrg() external view returns (bool);
    function isCus() external view returns (bool);
    function newCustomer(
        string calldata _name,
        string calldata _aadhar, 
        string calldata _pan,
        string calldata _hash,
        address _bank
    ) external payable returns (bool);
    function newOrganisation(
        string calldata _name
    ) external payable returns (bool);
    function viewCustomerData(
        address _address
    ) external view returns (string memory);
    function modifyCustomerData(
        string calldata _name,
        string calldata _hash,
        address _bank
    ) external payable returns (bool);
    function checkStatus() external returns (Status);
    function changeStatusToAccepted(address _custaddress) external payable;
    function changeStatusToRejected(address _custaddress) external payable;
    function viewRequests() external view returns (address[] memory);
    function viewName(address _address) external view returns (string memory);
}

contract KycBlockChain is KYC_Functions {
    address[] public Banks;
    address[] public Requests;
    uint public bankslength = 0;

    enum Entity {
        Customer,
        Organisation
    }

    struct Customer {
        string c_name;
        string aadhar;
        string pan;
        string data_hash;
        address bank_address;
        bool exists;
        Entity entity;
    }

    struct Organisation {
        string b_name;
        bool exists;
        Entity entity;
        mapping(address => Status) requests;
        address[] allrequests;
    }

    mapping(address => Customer) allCustomers;
    mapping(address => Organisation) allOrganisations;

    function isOrg() public view override returns (bool) {
        // added 'override'
        if (allOrganisations[msg.sender].exists) {
            return true;
        }
        return false;
    }

    function isCus() public view override returns (bool) {
        // added 'override'
        if (allCustomers[msg.sender].exists) {
            return true;
        }
        return false;
    }

    function newCustomer(
        string memory _name,
        string calldata _aadhar, 
        string calldata _pan,
        string memory _hash,
        address _bank
    ) public payable override returns (bool) {
        // added 'override'
        require(!isCus(), "Customer Already Exists!");
        require(allOrganisations[_bank].exists, "No such Bank!");
        allCustomers[msg.sender].c_name = _name;
        allCustomers[msg.sender].aadhar = _aadhar;
        allCustomers[msg.sender].pan = _pan;
        allCustomers[msg.sender].data_hash = _hash;
        allCustomers[msg.sender].bank_address = _bank;
        allCustomers[msg.sender].exists = true;
        allCustomers[msg.sender].entity = Entity.Customer;
        notifyBank(_bank);
        return true;
    }

    function newOrganisation(
        string memory _name
    ) public payable override returns (bool) {
        // added 'override'
        require(!isOrg(), "Organisation already exists with the same address!");
        allOrganisations[msg.sender].b_name = _name;
        allOrganisations[msg.sender].exists = true;
        allOrganisations[msg.sender].entity = Entity.Organisation;
        Banks.push(msg.sender);
        bankslength++;
        return true;
    }

    function viewCustomerData(
        address _address
    ) public view override returns (string memory) {
        // added 'override'
        require(isOrg(), "Access Denied");
        if (allCustomers[_address].exists) {
            return allCustomers[_address].data_hash;
        }
        return "No such Customer in the database";
    }

    function modifyCustomerData(
        string memory _name,
        string memory _hash,
        address _bank
    ) public payable override returns (bool) {
        // added 'override'
        require(isCus(), "You are not a customer");
        allCustomers[msg.sender].c_name = _name;
        allCustomers[msg.sender].data_hash = _hash;
        allCustomers[msg.sender].bank_address = _bank;
        return true;
    }

    function notifyBank(address _bankaddress) internal {
        allOrganisations[_bankaddress].requests[msg.sender] = Status.Pending;
        allOrganisations[_bankaddress].allrequests.push(msg.sender);
    }

    function checkStatus() public override returns (Status) {
        // added 'override'
        require(isCus(), "You are not a customer");
        address _presbank = allCustomers[msg.sender].bank_address;
        return allOrganisations[_presbank].requests[msg.sender];
    }

    function changeStatusToAccepted(
        address _custaddress
    ) public payable override {
        // added 'override'
        require(isOrg(), "You are not permitted to use this function");
        address _bank = allCustomers[_custaddress].bank_address;
        require(
            _bank == msg.sender,
            "You dont have access to verify this data"
        );
        allOrganisations[msg.sender].requests[_custaddress] = Status.Accepted;
    }

    function changeStatusToRejected(
        address _custaddress
    ) public payable override {
        // added 'override'
        require(isOrg(), "You are not permitted to use this function");
        address _bank = allCustomers[_custaddress].bank_address;
        require(
            _bank == msg.sender,
            "You dont have access to verify this data"
        );
        allOrganisations[msg.sender].requests[_custaddress] = Status.Rejected;
    }

    // function viewRequests() public view override returns (address[] memory) {
    //     // added 'override'
    //     // require(isOrg(),"You are not Permitted");
    //     return allOrganisations[msg.sender].allrequests;
    // }

    function viewRequests() public view override returns (address[] memory) {
        uint count = allOrganisations[msg.sender].allrequests.length;

        uint pendingCount = 0;
        for (uint i = 0; i < count; i++) {
            address requestAddress = allOrganisations[msg.sender].allrequests[
                i
            ];
            if (
                allOrganisations[msg.sender].requests[requestAddress] ==
                Status.Pending
            ) {
                pendingCount++;
            }
        }

        address[] memory pendingRequests = new address[](pendingCount);
        uint index = 0;

        for (uint i = 0; i < count; i++) {
            address requestAddress = allOrganisations[msg.sender].allrequests[
                i
            ];
            if (
                allOrganisations[msg.sender].requests[requestAddress] ==
                Status.Pending
            ) {
                pendingRequests[index] = requestAddress;
                index++;
            }
        }

        return pendingRequests;
    }

    function viewName(
        address _address
    ) public view override returns (string memory) {
        // added 'override'
        require(isOrg(), "Not an Organisation");
        return allCustomers[_address].c_name;
    }

    function getBanks() public view returns (BankInfo[] memory) {
        BankInfo[] memory banksList = new BankInfo[](Banks.length);

        for (uint i = 0; i < Banks.length; i++) {
            address bankAddr = Banks[i];
            banksList[i] = BankInfo({
                b_name: allOrganisations[bankAddr].b_name,
                bankAddress: bankAddr
            });
        }

        return banksList;
    }
}
