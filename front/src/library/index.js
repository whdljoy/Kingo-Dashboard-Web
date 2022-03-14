import { Web3Provider } from "@ethersproject/providers";

function getLibrary(provider) {
  // provider : 메타마스크
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

export default getLibrary;