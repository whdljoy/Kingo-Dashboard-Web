import { InjectedConnector } from "@web3-react/injected-connector";

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    1, // Mainet : 이더리움
    3, // Ropsten : 이더리움
    4, // Rinkeby : 이더리움
    5, // Goerli : 이더리움
    42, // Kovan : 이더리움
    1001, // baobab : 클레이튼 (후에 baobab테스트넷이 아닌 메인넷을 사용할 것이라면 클레이튼 메인넷에 맞는 chainid를 추가하면 됩니다.)
  ],
});