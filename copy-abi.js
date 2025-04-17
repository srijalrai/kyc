const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "build/contracts/KycBlockChain.json");
const dest = path.join(__dirname, "src/utils/KycBlockChain.json");

fs.copyFileSync(src, dest);
console.log("✅ ABI copied to client/src/utils/");