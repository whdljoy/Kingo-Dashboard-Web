const IPFSCONTRACT = artifacts.require("Ipfs");
const fs = require("fs");

module.exports = function (deployer) {
  let name = "IPFSADDRESS";
  let symbol = "IPFSADDRESS";

  deployer.deploy(IPFSCONTRACT, name, symbol).then(() => {
    if (IPFSCONTRACT._json) {
      fs.writeFile(
        "deployedABI",
        JSON.stringify(IPFSCONTRACT._json.abi),
        (err) => {
          if (err) throw err;
          console.log("파일에 ABI 입력 성공");
        }
      );
    }

    fs.writeFile("deployedAddress", IPFSCONTRACT.address, (err) => {
      if (err) throw err;
      console.log("파일에 주소 입력 성공");
    });
  });
};
