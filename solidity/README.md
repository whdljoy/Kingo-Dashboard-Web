npm install 따로 할 필요없이 node_modules까지 올렸습니다.
caver-js 업데이트로 webpack 호환성 문제 때문에 2022-1월 초에 npm install 했던 caver-js파일이 에러가 발생하지 않기 때문에 그걸로 써야합니다.
npm install caver-js@x.x.x해도 오류 해결이 안됨..

여기서 처리했던 작업은
react-script 5버전이 아닌 4.0.3버전으로 바꿨고,
webpack을 4.44.2버전을 설치했으며,
truffle init을 통해 truffle-config.js, contracts폴더, migrations폴더를 생성해줬으며,
/contracts/Ipfs.sol파일과 /migrations/2_deploy_IPFS.js 파일을 작성한후

명령어 truffle migrate --compile-all --reset --network klaytn로 스마트 컨트랙트를 클레이튼 바오밥 네트워크에 배포하였으며
해당 컨트랙트의 ABI와 ADDRESS를 /src/contractinfo에 담아뒀습니다.

배포한 컨트랙트의 주소는 /src/contractinfo/deployedAddress.json에 있는데 json형식으로 저장해야했기 때문에 Address정보를 불러오려면
jsx 파일에서 import DEPLOYED_ADDRESS from "../경로" 해주고
const address = DEPLOYED_ADDRESS["key"]를 해줘야 address를 불러올 수 있습니다. DEPLOYED_ADDRESS 자체는 object 형식이기 때문에 컨트랙트 address가 아닙니다.

caver.js는 현재 1.0.0버전을 사용 중입니다.(나중에 webpack 호환 문제가 해결된다면 수정할 예정입니다.)

CONTRACT의 ABI는 ADDRESS와 다르게 그냥 쓰시면 됩니다.ㄴ
