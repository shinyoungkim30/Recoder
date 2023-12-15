# 스마트물류창고 (팀명 : Re:coder)

![image](https://github.com/2023-SMHRD-SW-Fullstack-1/Recoder/assets/130376882/6a9dac1b-5166-4a41-ae08-88a4b0ea61bd)


## 👀 서비스 소개
* 서비스명 :  스마트물류창고
* 서비스설명 : 3D형태로 창고 내부 모습을 구현해 창고 데이터를 실시간으로 시각화 한 스마트 물류 관리 시스템
 <h4>서비스 개발 목표</h4> 

* 3D 창고 화면으로 재고 데이터를 시각화하고 실시간 모니터링 가능 <br>
* 전산 시스템에 저장된 데이터를 시각적으로 표현하여 창고 상황을 직관적으로 이해할 수 있어 창고 관리 효율 증가
 <h4>서비스 개발 내용</h4> 
① 창고 생성 및 관리 <br>
ㅤ사용자는 자신의 창고를 3D로 생성, 삭제할 수 있다. <br><br>
② 선반 생성 <br>
ㅤ사용자는 각 창고마다 선반을 3D로 생성 삭제할 수 있다 <br><br>
③ 상품 적재 <br>
ㅤ사용자는 창고에 상품을 3D로 적재, 이동, 삭제 시킬 수 있다 <br><br>
④ 실시간 데이터 연동 <br>
ㅤ같은 회사 정보로 가입한 사용자들은 실시간 데이터 연동이 가능하다 <br><br>
⑤ 재고 수량 관리 <br>
ㅤ사용자는 자신이 설정한 재고량과 현재 재고량을 비교해서 적정 재고량을 유지할 수 있다 <br><br>
⑥ 출고 통계 <br>
ㅤ각 제품이 어느 판매지에 얼만큼 출고 되었는지 확인할 수 있다 <br><br>

<br>

## 📅 프로젝트 기간
2023.08.23 ~ 2023.10.05 (7주)
<br><br>

## ⭐ 주요 기능

* 기능1 : 3D창고, 선반, 제품 생성 및 삭제 기능 (three.js 활용)
* 기능2 : 상품 적재 데이터의 3D 시각화 (three.js 활용)
* 기능3 : Socket io를 활용한 실시간 데이터 연동
* 기능4 : 재고 수량 관리 기능
* 기능5 : 출고 통계 기능

<br>

## ⛏ 기술스택
<table>
    <tr>
        <th>구분</th>
        <th>내용</th>
    </tr>
    <tr>
        <td>사용언어</td>
        <td>
            <img  src="https://img.shields.io/badge/HTML-E34F26?style=flat-square&logo=html5&logoColor=white"/> 
            <img  src="https://img.shields.io/badge/CSS-1572B6?style=flat-square&logo=css3&logoColor=white"/> 
            <img  src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=JavaScript&logoColor=white"/>
        </td>
    </tr>
    <tr>
        <td>라이브러리</td>
        <td>
            <img  src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=white"/> 
            <img  src="https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=threedotjs&logoColor=white"/> 
            <img  src="https://img.shields.io/badge/Sequelize-52B0E7?style=flat-square&logo=sequelize&logoColor=white"/>
            <img  src="https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socketdotio&logoColor=white"/>
            <img  src="https://img.shields.io/badge/Bootstrap-7952B3?style=flat-square&logo=bootstrap&logoColor=white"/> 
            <img  src="https://img.shields.io/badge/MUI-007FFF?style=flat-square&logo=mui&logoColor=white"/>            
        </td>
    </tr>
    <tr>
        <td>개발도구</td>
        <td>
            <img  src="https://img.shields.io/badge/VSCode-007ACC?style=flat-square&logo=visualstudiocode&logoColor=white"/>
            <img  src="https://img.shields.io/badge/Postman-FF6C37?style=flat-square&logo=postman&logoColor=white"/>
        </td>
    </tr>
    <tr>
        <td>서버환경</td>
        <td>
            <img  src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white"/>
        </td>
    </tr>
    <tr>
        <td>데이터베이스</td>
        <td>
            <img  src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white"/>
        </td>
    </tr>
    <tr>
        <td>협업도구</td>
        <td>
            <img  src="https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white"/> 
            <img  src="https://img.shields.io/badge/Github-181717?style=flat-square&logo=github&logoColor=white"/>
        </td>
    </tr>
</table>

<br><br>

## ⚙ 시스템 아키텍처
![image](https://github.com/2023-SMHRD-SW-Fullstack-1/Recoder/assets/130376882/93cc57d2-5d92-40b6-8324-c3f2647f1b16)


<br>

## 📌 서비스 흐름도
![image](https://github.com/2023-SMHRD-SW-Fullstack-1/Recoder/assets/130376882/b0c46314-1076-4f20-943b-65c01ce3393a)

<br>

## 📌 ER다이어그램
![image](https://github.com/2023-SMHRD-SW-Fullstack-1/Recoder/assets/130376882/2438f481-d756-4c58-a95e-4c3ee367c74e)


<br>

## 🖥 화면 구성

### 메인화면
<br>

![image](https://github.com/2023-SMHRD-SW-Fullstack-1/Recoder/assets/130376882/3ce99f4c-ab2d-40c3-8a56-74db5f8c3542)


### 창고생성

![image](https://github.com/2023-SMHRD-SW-Fullstack-1/Recoder/assets/130376882/3170ab20-0509-4aab-9377-fc37b5bdece7)



<br>

### 선반생성
![image](https://github.com/2023-SMHRD-SW-Fullstack-1/Recoder/assets/130376882/3945d62a-291b-4591-8131-e69f48a0617c)


<br>

### 적재
![제목_없는_디자인](https://github.com/2023-SMHRD-SW-Fullstack-1/Recoder/assets/130376882/20e47e01-bd26-4aa4-8f23-35e4056a503f)

<br>

### 재고 수량 관리
![image](https://github.com/2023-SMHRD-SW-Fullstack-1/Recoder/assets/130376882/762912a4-179e-44b0-8337-9bd0ad42d1ce)


<br>

### 출고 통계
![image](https://github.com/2023-SMHRD-SW-Fullstack-1/Recoder/assets/130376882/7ef03852-03c2-4797-86bf-7841c82b3b9c)



### 시연 영상
https://github.com/2023-SMHRD-SW-Fullstack-1/Recoder/assets/130376882/4d9305b2-f1f8-477c-b859-0a3fc584f062
