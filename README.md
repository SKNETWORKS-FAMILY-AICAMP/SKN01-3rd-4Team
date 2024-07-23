# SKN01-3nd-4Team
### 🧑🏻‍🌾 TextFarmers(TF)

# 1. Introduction Team (팀 소개)
<table align="center">
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
          <img src="https://github.com/user-attachments/assets/c7df2eb9-d897-4acc-87a9-3cdbca2863a6"width="100px;"height="100px;"" alt=""/>
          <a href="https://github.com/2kilometer"><div align=center>이경민</div></a>
        </div>
      </td>
      <td align="center">
        <div>
          <img src="https://github.com/user-attachments/assets/4d97616d-34b6-4495-aa18-dc1bb2733d4a"width="100px;"height="100px;" alt=""/>
          <a href="https://github.com/JUNGUIHEON"><div align=center>정의헌</div></a>
        </div>
      </td>
      <td align="center">
        <div>
          <img src="https://github.com/user-attachments/assets/c6970ea6-9c4d-4cc9-ba64-89db9bfe586f"width="100px;"height="100px;" alt=""/>
          <a href="https://github.com/RUVIST"><div align=center>최명근</div></a>
        </div>
      </td>
    </tr>
  </tbody>
</table>

# 2. Introduction Project (프로젝트 개요)
### 🧡 소개 🧡
러닝 유저들을 위한 러닝화 쇼핑 플랫폼을 CI/CD 구축하기 
### 💚 필요성 💚
 ![image](https://github.com/user-attachments/assets/437f0572-0be7-4849-a690-fa9a259a98a0)</br>
위에 보이듯이 SNS상에서도 러닝은 큰 유행을 타며 이제는 일상이 되었습니다.</br>
이로 인해 러닝을 즐기는 사람들을 위해서 주요 5대 브랜드의 런닝화 상품을 판매하는 쇼핑몰을 만들고,</br>
가입고객 이탈 예측 및 구매 동향을 분석하여 관리파 페이지에 레포트로 제공하는 플랫폼을 개발하기로 하였습니다.

## CI/CD란 ?
대충 CI/CD 관련해서 작성


# 3. ERD 구성
![image](https://github.com/user-attachments/assets/f5dafd4b-5ead-4b75-91c6-c00e7c5f16ec)

## 애자일 보드를 사용하는 이유
```c
과거 정의서들을 일일히 작성하였지만 빠른 속도로 무언가를 개발하는데 한계가 있습니다.
처음부터 많은 것들을 빌드업하면서 빠른 생산성을 기반으로 움직이려면 반드시 애자일해야합니다.
고로 폭포수 설계 방식이 아닌 애자일 프로세스 방식으로 애자일 보드를 작성하면서 진행했습니다.

애자일 보드는 자체적으로 제목이 요구 사항을 내포하며 각 카드 내부에는 정의한 Domain의 세부 사항이 기록됩니다.
고로 빠르게 팀원들과 협업 할 수 있고 소통 비용을 최소화시킬 수 있습니다.
작은 것 같지만 이와 같은 것들이 쌓여서 아주 기민하고 민첩한 조직을 만들어 냅니다.
```

# 4. Backend 애자일 보드 - 요구사항 정의서
<img src="https://github.com/user-attachments/assets/d749633c-5a18-423f-a709-4b1dadcef73b" />

<!-- ## 더미데이터 생성 방식
**계정 생성**</br>
![image](https://github.com/user-attachments/assets/4e395179-bae0-4643-954a-09270f696573)</br>
**로그인 기록 생성**</br>
![image](https://github.com/user-attachments/assets/37f684fe-03d5-411a-ad32-8b830eac1e34)</br>
**주문 생성**</br>
![image](https://github.com/user-attachments/assets/56cdf0c6-366c-4900-b937-9bb92c845f17)</br>
-->

# 5. Frontend 애자일 보드 - 화면 설계서
<img src="https://github.com/user-attachments/assets/13856381-cd4e-453e-a1f7-a66a8c0e8744" />

# 6. FastAPI 애자일 보드 - AI 서빙 설계서
<img src="https://github.com/user-attachments/assets/41b3c5e2-0784-46cb-8e09-cf494f34ce58" />

# 7. 시스템 구성도
![image](https://github.com/user-attachments/assets/612d28ce-3f5d-4816-85d3-2269029b16f1)

# 8. Manual Deploy(수동 배포 진행 절차)
## Frontend (UI)
![image](https://github.com/user-attachments/assets/e241a2e2-56c8-4e8f-933b-3890e2ec9959)
![image](https://github.com/user-attachments/assets/fa154f7c-a0dc-4049-b8b0-d7848aea9ada)
## Backend (Server)
1. 개발자가 GitHub 저장소에 작업내용을 푸쉬하거나 PR을 생성하고 관리자가 이를 승인합니다. (이 이벤트는 GitHub Actions 워크플로우를 트리거합니다.)
2. GitHub Actions 에서 CI(테스트)를 진행하고 통과하면 npm build를 통해 Docker 이미지를 빌드합니다. (빌드 결과로 html, css, javascript, 리소스 등이 나옵니다.)
3. 빌드가 완료되면 GHCR(GitHub Container Registry)에 push합니다.
4. GitHub Actions에서 AWS Security Group설정을 통해 AWS 서버와 연동합니다.
5. GHCR에서 연동된 AWS 서비스로 이미지를 pull(배포) 합니다.
6. AWS서버에서 이미지를 docker-compose로 컨테이너화합니다.
7. nginx를 구동하여 frontend코드가 동작합니다. (nginx는 구동시 docker-compose.yml을 참조하여 어떤 javascript, html, css를 참조할지 판정합니다.)
8. 이 과정이 완료되면 사용자가 AWS서버에 접속하여 서비스를 사용할 수 있습니다.
## FastAPI (AI Core Server)


# 9. Autonomous Deploy (자동 배포 진행 절차)
## Frontend
### 🩵 CI 구성 🩵
### 🌈 1 
<img src="https://github.com/user-attachments/assets/b2b8eda5-9f59-497d-9595-b9c0b909e96c"/>

### 🌈 2️
<img src="https://github.com/user-attachments/assets/920ad1f8-cace-48bc-b616-cff5f7fe31da"/>

### 🌈 3
```bash
name: CI (Continuous Integration)

on:
  push:
    branches: ["main"]

jobs:
  build:
    name: Frontend CI
    runs-on: ubuntu-latest
    steps:
    - name: Checkout repository
      uses: actions/checkout@v3

    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '20'

    - name: Cache dependencies
      id: cache
      uses: actions/cache@v3
      with:
        path: '**/node_modules'
        key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
        restore-keys: |
          ${{ runner.os }}-node-

    - name: Install Dependencies
      if: steps.cache.outputs.cache-hit != 'true'
      run: |
        npm ci

    - name: Create .env development for CI
      run: |
        pwd
        echo "${{ secrets.ENV_DEVELOPMENT }}" > .env.development
        cat .env.development

    - name: Real Test
      run: |
        npm run test:unit

    - name: send FRONTEND_TEST_FINISH_TRIGGER
      run: |
        curl -S -X POST https://api.github.com/repos/${{ github.repository }}/dispatches \
          -H 'Accept: application/vnd.github.v3+json' \
          -u ${{ secrets.GHCR_TOKEN }} \
          -d '{"event_type": "FRONTEND_TEST_FINISH_TRIGGER", "client_payload": { "repository": "'"$GITHUB_REPOSITORY"'" }}'
```

### 🌈 4
<img src="https://github.com/user-attachments/assets/91ff498e-c28f-4062-9f38-593936610521"/>

### 💙 CD 구성 💙
### 🌈 1
```bash
name: CD (Continuous Deploy)

on:
  repository_dispatch:
    types: [FRONTEND_TEST_FINISH_TRIGGER]

jobs:
  build:
    name: build-app
    runs-on: ubuntu-latest
    steps:
    - name: Get Github Actions IP
      id: ip
      uses: haythem/public-ip@v1.2

    - name: Configure AWS IAM Credentials
      uses: aws-actions/configure-aws-credentials@v1
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ap-northeast-2

    - name: Checkout repository
      uses: actions/checkout@v3

    - name: Setup node.js
      uses: actions/setup-node@v2
      with:
        node-version: '20'

    - name: Cache dependencies
      id: cache
      uses: actions/cache@v3
      with:
        path: '**/node_modules'
        key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
        restore-keys: |
          ${{ runner.os }}-node-

    - name: Install Dependencies
      if: steps.cache.outputs.cache-hit != 'true'
      run: |
        npm ci --legacy-peer-deps

    - name: Create .env.production for Continuous Deploy
      run: |
        echo "${{ secrets.ENV_PRODUCTION }}" > .env.production
        cat .env.production

    - name: Build
      run: |
        npm run build
        ls

    - name: Setup SSH
      uses: webfactory/ssh-agent@v0.5.0
      with:
        ssh-private-key: ${{ secrets.PRIVATE_KEY }}

    - name: Add Github Actions IP to Security Group
      run: |
        aws ec2 authorize-security-group-ingress --group-id ${{ secrets.AWS_SG_ID }} --protocol tcp --port 22 --cidr ${{ steps.ip.outputs.ipv4 }}/32

    - name: SCP Action
      uses: appleboy/scp-action@master
      with:
        host: ${{ secrets.HOST_IP }}
        username: ec2-user
        key: ${{ secrets.PRIVATE_KEY }}
        source: "./dist/**"
        target: "/home/ec2-user/text-farmer/actions-frontend"

    - name: Remove Github Actions IP From Security Group
      run: |
        aws ec2 revoke-security-group-ingress --group-id ${{ secrets.AWS_SG_ID }} --protocol tcp --port 22 --cidr ${{ steps.ip.outputs.ipv4 }}/32

    - name: SSH Agent Cleanup
      if: ${{ always() }}
      uses: webfactory/ssh-agent@v0.5.0
      with:
        ssh-private-key: ${{ secrets.PRIVATE_KEY }}

  deploy:
    name: Deploy to Production
    needs: build
    runs-on: [ self-hosted, deploy-text-farmer-frontend ]
    steps:
      - name: Get Github Actions IP
        id: ip
        uses: haythem/public-ip@v1.2
        
      - name: Configure AWS IAM Credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-northeast-2

      - name: Add Github Actions IP to Security Group
        run: |
          aws ec2 authorize-security-group-ingress --group-id ${{ secrets.AWS_SG_ID }} --protocol tcp --port 22 --cidr ${{ steps.ip.outputs.ipv4 }}/32
    
      - name: Deploy to Production
        uses: appleboy/ssh-action@v0.1.10
        with:
          host: ${{ secrets.HOST_IP }}
          username: ec2-user
          key: ${{ secrets.PRIVATE_KEY }}
          script_stop: true
          script: |
            pwd
            cd /home/ec2-user/text-farmer/vue-frontend
            cp -r /home/ec2-user/text-farmer/actions-frontend/dist/* ./html/

            docker image prune -f
            docker logout

            docker-compose up -d

      - name: Remove Github Actions IP From Security Group
        run: |
          aws ec2 revoke-security-group-ingress --group-id ${{ secrets.AWS_SG_ID }} --protocol tcp --port 22 --cidr ${{ steps.ip.outputs.ipv4 }}/32
```

### 🌈 2
<img src="https://github.com/user-attachments/assets/e875aa03-94cf-44ea-9dfc-53095f49e699"/>

### 🌈 3
<img src="https://github.com/user-attachments/assets/45af381a-97ce-4104-b5fd-3226fbf9cb47"/>

### 🌈 4
<img src="https://github.com/user-attachments/assets/08e78c76-2d55-4cc5-bc98-fda319631720"/>

### 🌈 5
<img src="https://github.com/user-attachments/assets/05db1246-1846-46f1-a853-b5bfbdaa208c"/>

### 🌈 6
<img src="https://github.com/user-attachments/assets/86fe880c-c611-4090-ae6d-c0187b518caa"/>

### 🌈 7
```bash
mkdir frontend-action-runner
cd frontend-action-runner
```

### 🌈 7
```bash
curl -o actions-runner-linux-arm64-2.317.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.317.0/actions-runner-linux-arm64-2.317.0.tar.gz
```

### 🌈 8
```bash
sudo yum install perl-Digest-SHA -y
```

### 🌈 9
```bash
tar xzf ./actions-runner-linux-arm64-2.317.0.tar.gz
```

### 🌈 10
<img src="https://github.com/user-attachments/assets/c88291d6-d8af-45a5-801f-4d7152a8aa01"/>

### 🌈 11
```bash
sudo yum install libicu -y
```

### 🌈 12
<img src="https://github.com/user-attachments/assets/400a577a-f6ea-4bc4-84df-82b252d90fa0"/>

### 🌈 13
<img src="https://github.com/user-attachments/assets/94c7a2f9-c89a-4af9-a729-a1230064cd07"/>

### 🌈 14
<img src="https://github.com/user-attachments/assets/ff71d1cb-93cb-445d-97dc-ba0ea5b439fc"/>

### 🌈 15
<img src="https://github.com/user-attachments/assets/785a3687-a5ec-493e-9aab-8474ae2f1880"/>

### 🌈 16
<img src="https://github.com/user-attachments/assets/edd7b035-84fc-47d0-a399-3c8f08de07d8"/>

### 🌈 17
```bash
nohup ./run.sh > run.log 2>&1 &
```

# 10. Result (수행 결과)

**사이트 화면**
![image](https://github.com/user-attachments/assets/83f21247-56f8-41d8-ab75-1197fa020d03)
![image](https://github.com/user-attachments/assets/cd8d817f-5fe2-41bc-9f3f-8c4112efba4e)
![image](https://github.com/user-attachments/assets/faa7942a-0d82-45de-b6b1-e9d6c6c4da35)
![image](https://github.com/user-attachments/assets/386da3c1-478d-427d-8e9e-d70c34898af7)
![image](https://github.com/user-attachments/assets/c64c8885-23ed-4093-be4e-f051b3586627)
![image](https://github.com/user-attachments/assets/8bbf74bc-3c9b-433f-9c71-0b6e63a3bb9b)
![image](https://github.com/user-attachments/assets/bd147f60-458f-4353-bb61-f780b8871ba2)


**회원 예측**
![image](https://github.com/user-attachments/assets/f3d259ef-a6d3-4558-9766-9a15fca97e97)
![image](https://github.com/user-attachments/assets/1913abfc-e505-41d2-872b-dee1fcaebde8)
![image](https://github.com/user-attachments/assets/f4970285-4242-4bfa-a107-2ec114ae76e2)
![image](https://github.com/user-attachments/assets/25ed50c0-76a3-4fb6-be93-c6e4dde1a708)
![image](https://github.com/user-attachments/assets/cf0a1767-2ab7-4d79-820e-06c80b0cf756)

# 11. Tech Stack (기술 스택)
<div align=left><h3>🕹️ Frontend</div>
<div align=left>
  <img src="https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=Vue.js&logoColor=white">
  <img src="https://img.shields.io/badge/Vuetify-1867C0?style=for-the-badge&logo=Vuetify&logoColor=white">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white">
  <img src="https://img.shields.io/badge/D3.js-F9A03C?style=for-the-badge&logo=D3.js&logoColor=white">
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=Axios&logoColor=white">
</div>

<div align=left><h3>🕹️ Backend</div>
<div aling=left>
  <img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=Django&logoColor=white">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=Python&logoColor=white">
  <img src="https://img.shields.io/badge/Pandas-150458?style=for-the-badge&logo=Pandas&logoColor=white">
  <img src="https://img.shields.io/badge/Redis-FF4438?style=for-the-badge&logo=Redis&logoColor=white">
  <img src="https://img.shields.io/badge/KakaoDev-221E68?style=for-the-badge&logo=Kakao&logoColor=white">
</div>

<div align=left><h3>🕹️ AI Core</div>
<div align=left>
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=white">
  <img src="https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=TensorFlow&logoColor=white">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=Python&logoColor=white">
</div>

<div align=left><h3>🕹️ Infra</div>
<div align="left">
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=Docker&logoColor=white">
  <img src="https://img.shields.io/badge/GitHub Actions-2088FF?style=for-the-badge&logo=GitHub Actions&logoColor=white">
  <img src="https://img.shields.io/badge/GitHub Runner-2088FF?style=for-the-badge&logo=GitHub Runner&logoColor=white">
</div>
                                                                                                       

# 12. Deploy Issue (배포 이슈)
- **FastAPI 수동 배포 중 Docker Image 오류**
  ![image](https://github.com/user-attachments/assets/aacbbebb-578a-4baf-94a9-1de2f7199b89)
  - **오류** : "Error response from daemon: mainfest unknown"
  - **오류 원인** : 진행할 Docker Image가 없거나 사용이 불가한 상황
  - **오류 해결** : Docker Build 과정에서 사용한 Github 계정은 Login할 때도 동일하게 사용
    - Docker Build를 진행하는 프로젝트에서도 Docker Login <br>
      ```bash
      echo "GHCR토큰" | docker login ghcr.io -u 계정 --password-stdin
      ```
    - AWS 접속 후 docker-compose.yml 파일 구동 시에도 Docker Login <br>
      ```bash
      echo "GHCR토큰" | docker login ghcr.io -u 계정 --password-stdin
      ```
    - .env로 관리하는 정보에 Github 계정은 docker build 구성할 때 사용한 계정

- **Frontend에서 Backend 요청을 받지 못하는 오류**
  - **오류** : Bakcend가 실행되지 않음
  - **오류 원인** : 진행할 Docker Image가 없거나 사용이 불가한 상황
  - **오류 해결** : Docker Build 과정에서 사용한 Github 계정은 Login할 때도 동일하게 사용
    - Docker Build를 진행하는 프로젝트에서도 Docker Login <br>
      
echo "GHCR토큰" | docker login ghcr.io -u 계정 --password-stdin
    - AWS 접속 후 docker-compose.yml 파일 구동 시에도 Docker Login <br>
      
echo "GHCR토큰" | docker login ghcr.io -u 계정 --password-stdin
    - .env로 관리하는 정보에 Github 계정은 docker build 구성할 때 사용한 계정


# 13. 테스트 보고서 (CI 테스트 결과)

# 14. 한 줄 회고
### 🌊 이경민
자동화된 테스트 덕분에 코드 품질이 눈에 띄게 향상되어 뿌듯했지만, 설정 과정에서 많은 시행착오를 겪으며 좌절하기도 했다.
### 😈 임영훈
CI/CD 도입으로 배포 시간이 크게 단축되어 팀 전체가 성취감을 느꼈지만, 새로운 시스템을 배우느라 초반에는 많이 혼란스러웠다.
### 🌋 정의헌
자동화된 파이프라인 덕분에 팀원들과의 협업이 한결 수월해졌고, 문제 해결 과정에서도 큰 만족감을 느꼈다.
### 🌾 최명근
지속적인 통합 덕분에 작은 변화들도 빠르게 배포할 수 있어 좋았지만, 예상치 못한 문제들이 발생할 때마다 긴장감이 느껴졌다.
