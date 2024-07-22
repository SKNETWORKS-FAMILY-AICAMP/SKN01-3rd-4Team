# SKN01-3nd-4Team
SKN01-3nd-4Team

# 1. Introduction Team (팀 소개)
<table align=center>
  <tbody>
    <tr>
      <td align="center">
        <div>
          <img src="https://github.com/user-attachments/assets/7cbbcc77-39de-4dc6-be12-a2879ce15a0b"width="100px;"height="100px;" alt=""/>
          <a href="https://github.com/yhoon3002"><div align=center>팀장 임영훈</div></a>
        </div>
      </td>
      <td align="center">
        <div>
          <img src="https://github.com/user-attachments/assets/4d97616d-34b6-4495-aa18-dc1bb2733d4a"width="100px;" alt=""/>
          <a href="https://github.com/2kilometer"><div align=center>이경민</div></a>
        </div>
      </td>
      <td align="center">
        <div>
          <img src="https://github.com/user-attachments/assets/4d97616d-34b6-4495-aa18-dc1bb2733d4a"width="100px;" alt=""/>
          <a href="https://github.com/JUNGUIHEON"><div align=center>정의헌</div></a>
        </div>
      </td>
      <td align="center">
        <div>
          <img src="https://github.com/user-attachments/assets/4d97616d-34b6-4495-aa18-dc1bb2733d4a"width="100px;" alt=""/>
          <a href="https://github.com/RUVIST"><div align=center>최명근</div></a>
        </div>
      </td>
    </tr>
  </tbody>
</table>

# 2. Introduction Project (프로젝트 개요)
- 프로젝트 명: TransFarmers(TF)
- 프로젝트 소개: 의료 데이터를 활용한 챗봇 서비스
- 프로젝트 배경:</br>
  현대 사회에서 의료 데이터의 중요성이 점점 커지고 있지만 복잡한 의료 정보와 데이터는 일반 대중에게 쉽게 접근하기 어렵습니다.</br>
  이를 해결하기 위해 의료 데이터를 효과적으로 활용하여 사용자 친화적인 챗봇 서비스를 개발하고자 합니다.</br>
  이를 사용함으로써, 언제 어디서나 쉽게 접근할 수 있는 의료 정보와 상담 서비스를 통해 사용자의 편의를 도모할 수 있고,</br>
  개인의 건강 데이터를 바탕으로 한 맞춤형 건강 관리 팁 제공으로 사용자들의 건강 관리를 도울 수 있을것이라 기대합니다.
- 프로젝트 목표:</br>
  1. 의료 응답</br>
  사용자가 입력한 증상을 분석하여 가능한 질병을 예측하고, 적절한 행동(예: 병원 방문, 자가 치료)을 추천한다. 
  2. 간단한 의학적 응답</br>
  일반 건강 상식부터 특정 질병에 관한 정보까지, 신뢰할 수 있는 의료 데이터를 기반으로 한 다양한 정보를 제공한다.    
  3. 건강 관리 팁</br>
  개인의 건강 상태와 라이프스타일에 맞춘 맞춤형 건강 관리 팁을 제공한다.

# 3. ERD 구성

# 4. 데이터 수집 방식 (크롤링)

# 5. Streamlit 애플리케이션 사용 방식

# 6. Manual Deploy (수동 배포 진행 절차)

## Frontend (UI)

## Backend (Server)

## FastAPI (AI Core Server)

# 7. Autonomous Deploy (자동 배포 진행 절차)
![image](https://github.com/user-attachments/assets/612d28ce-3f5d-4816-85d3-2269029b16f1)

## Frontend (UI)
1. 개발자가 GitHub 저장소에 작업내용을 푸쉬하거나 PR을 생성하고 관리자가 이를 승인합니다. (이 이벤트는 GitHub Actions 워크플로우를 트리거합니다.)
2. GitHub Actions 에서 CI(테스트)를 진행하고 통과하면 npm build를 통해 Docker 이미지를 빌드합니다. (빌드 결과로 html, css, javascript, 리소스 등이 나옵니다.)
3. 빌드가 완료되면 GHCR(GitHub Container Registry)에 push합니다.
4. GitHub Actions에서 AWS Security Group설정을 통해 AWS 서버와 연동합니다.
5. GHCR에서 연동된 AWS 서비스로 이미지를 pull(배포) 합니다.
6. AWS서버에서 이미지를 docker-compose로 컨테이너화합니다.
7. nginx를 구동하여 frontend코드가 동작합니다. (nginx는 구동시 docker-compose.yml을 참조하여 어떤 javascript, html, css를 참조할지 판정합니다.)
8. 이 과정이 완료되면 사용자가 AWS서버에 접속하여 서비스를 사용할 수 있습니다.

## Backend (Server)

## FastAPI (AI Core Server)

# 8. Result (수행 결과)

# 9. Tech Stack (기술 스택)

# 10. 테스트 보고서 (CI 테스트 결과)

# 11. Agile Board (애자일 보드)

# 12. Deploy Issue (배포 이슈)

# 13. 한 줄 회고


