module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",  // Localhost
            port: 8545,         // Standard Ethereum port for local blockchain
            network_id: "*"     // Any network
        }
    },
    compilers: {
        solc: {
            version: "0.6.12"  // Match Solidity version for compatibility
        }
    }
};
