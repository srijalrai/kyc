pragma solidity >=0.4.21 <0.7.0;

interface KYC_Functions {
    enum Status {Accepted, Rejected, Pending}

    function isOrg() external view returns(bool);
    function isCus() external view returns(bool);
    function newCustomer(string calldata _name, string calldata _hash, address _bank) external payable returns(bool);
    function newOrganisation(string calldata _name) external payable returns(bool);
    function viewCustomerData(address _address) external view returns(string memory);
    function checkStatus() external returns(Status);
    function changeStatusToAccepted(address _custaddress) external payable;
    function changeStatusToRejected(address _custaddress) external payable;
    function viewRequests() external view returns(address[] memory);
    function viewName(address _address) external view returns(string memory);
}

contract KycBlockChain is KYC_Functions {
    address[] public Banks;
    address[] public Requests;
    uint public bankslength = 0;

    enum Entity { Customer, Organisation } 

    struct Customer {
        string c_name;
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

    function isOrg() public view override returns(bool) {
        return allOrganisations[msg.sender].exists;
    }

    function isCus() public view override returns(bool) {
        return allCustomers[msg.sender].exists;
    } 

    function newCustomer(string memory _name, string memory _hash, address _bank) public payable override returns(bool) {
        require(!isCus(), "Customer Already Exists!");
        require(allOrganisations[_bank].exists, "No such Bank!");
        allCustomers[msg.sender] = Customer(_name, _hash, _bank, true, Entity.Customer);
        notifyBank(_bank);
        return true;
    }

    function newOrganisation(string memory _name) public payable override returns(bool) {
    require(!isOrg(), "Organisation already exists with the same address!");
    
    Organisation storage org = allOrganisations[msg.sender];
    org.b_name = _name;
    org.exists = true;
    org.entity = Entity.Organisation;

    Banks.push(msg.sender);
    bankslength++;
    
    return true;
}


    function viewCustomerData(address _address) public view override returns(string memory) {
        require(isOrg(), "Access Denied");
        if (allCustomers[_address].exists) {
            return allCustomers[_address].data_hash;
        }
        return "No such Customer in the database";
    }


    function notifyBank(address _bankaddress) internal {
        allOrganisations[_bankaddress].requests[msg.sender] = Status.Pending;
        allOrganisations[_bankaddress].allrequests.push(msg.sender);
    }

    function checkStatus() public override returns(Status) {
        require(isCus(), "You are not a customer");
        return allOrganisations[allCustomers[msg.sender].bank_address].requests[msg.sender];
    }

    function changeStatusToAccepted(address _custaddress) public payable override {
        require(isOrg(), "You are not permitted to use this function");
        require(allCustomers[_custaddress].bank_address == msg.sender, "You don't have access to verify this data");
        allOrganisations[msg.sender].requests[_custaddress] = Status.Accepted;
    }

    function changeStatusToRejected(address _custaddress) public payable override {
        require(isOrg(), "You are not permitted to use this function");
        require(allCustomers[_custaddress].bank_address == msg.sender, "You don't have access to verify this data");
        allOrganisations[msg.sender].requests[_custaddress] = Status.Rejected;
    }

    function viewRequests() public view override returns(address[] memory) {
        require(isOrg(), "You are not Permitted");
        return allOrganisations[msg.sender].allrequests;
    }

    function viewName(address _address) public view override returns(string memory) {
        require(isOrg(), "Not an Organisation");
        return allCustomers[_address].c_name;
    } 
}
