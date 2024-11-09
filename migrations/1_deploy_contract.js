const KycBlockChain = artifacts.require("KycBlockChain");

module.exports = function (deployer) {
    deployer.deploy(KycBlockChain);
};
