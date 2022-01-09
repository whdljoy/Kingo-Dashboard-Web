# Make Dashboard Website and Connect 3rd-party with affiliate site

### 킹고 포인트와 관련하여 볼 수 있는 대시보드 웹사이트 제작
### 제휴사이트에서 메타마스크를 통한 신뢰성있는 포인트 제공을 위한 웹사이트 제작(3rd-party)
 
*  **개발 환경**  <br>
        **Front-end**: React  
        **Back-end**: Express.js  
        **DB**: mysql <br>   
        <ul> <li> 기본적으로 Node.js, npm, mysql 설치필요<br>
             <li> 필요 라이브러리들 설치 필요<br>
             <li> 파일들을 다운받으면 각 폴더에 terminal에서 npx create-react-app 명령을 통해 설치<br>
             <li>back/config/database.js 파일에서 각자의 로컬 mysql 비밀번호로 수정  <br>
             <li>back 폴더에서 npm start 후 front 폴더에서 npm start   <br>
        </ul> <br>
*  **진행 사항** 
    * Flask 코드 Express로 전환 완료
    * React에서 Express를 통해 axios로 DB데이터 들고 오기 완료<br>

*  **필요 기능**   
    - [ ] 학교 통합 로그인 기능 구현
    - [ ] 제휴 사이트에서 3rd-party 로서 포인트 제공 기능 구현
    - [ ] 가능하다면 3rd-party에서 Optional로 
    신뢰성 보장을 위한 블록체인 사용(메타마스크 연계)로서의 웹사이트 기능 분리
    - [ ] My 거래내역 페이지 그래프 구현(DB 수정 필요)  
    - [ ] 전체 거래 내역 페이지 완전 재구성  
        (Block들이 실제로 Transaction 되었는지 확인 할 수 있는 페이지로 재구성 DB 수정 필요)
    - [ ] IFPS 저장 후 일정 주기 별로 Transaction 보내기 기능 구현 <br>

 * **DB 상태**   
 
    <img src="https://user-images.githubusercontent.com/37110949/148679520-5216656b-f02d-4397-844e-c294d19a75d7.PNG" width ="300px" height="100px">

    <img src="https://user-images.githubusercontent.com/37110949/148679585-f47ed9ea-4fa2-411d-9897-5f440d68a825.png" width ="300px" height="300px">   
    <img src="https://user-images.githubusercontent.com/37110949/148679604-fca82a68-764f-43cb-a949-e2191627e67c.png" width ="300px" height="300px">