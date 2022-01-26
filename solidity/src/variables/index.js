import Caver from "caver-js";
import DEPLOYED_ABI from "../contractinfo/deployedABI.json";
import DEPLOYED_ADDRESS from "../contractinfo/deployedAddress.json";

const config = {
  rpcURL: "https://api.baobab.klaytn.net:8651",
};
const cav = new Caver(config.rpcURL);
const IPFSCONTRACT = new cav.klay.Contract(
  DEPLOYED_ABI,
  DEPLOYED_ADDRESS["key"]
);

let ipfsClient = require("ipfs-http-client");
let ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
});

export { cav, IPFSCONTRACT, ipfs };
