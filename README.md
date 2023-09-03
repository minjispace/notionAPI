# notion API

## 1. 실행 방법 참고
#### 1. **Git clone**
```
git clone https://github.com/minjispace/notionAPI.git
```

#### 2. **Nodemodules install**
```
yarn 
  or
npm i
```
#### 3. **Docker compose**
- docker 켜기
- docker compose up
```
docker compose up
```
#### 4. **Create database**
    - mysql container 들어가서 접속
        ```
        mysql -u root -p
        password: notionpassword
        ```
    - query.sql 코드 참고해서 복사해서 database 생성 (CREATE TABLE Pages)

#### 5. **Insert test data**
    - query.sql 코드 참고해서 복사해서 data 넣기 (INSERT INTO Pages)

#### 6. **Server start**
    ```
    yarn start 
        or
    npm run start
    ```

#### 7. **Postman Test**
🔥 API endpoint: **/api/v1/pages/:pageId**
    1. postman 실행
    2. GET http://localhost:3000/api/v1/pages/8
    3. 반환되는 데이터 값
    ```
    {
    "pageId": 8,
    "title": "2-1",
    "subPages": [
        {
        "pageId": 9,
        "title": "2-1-1"
        },
        {
        "pageId": 10,
        "title": "2-1-2"
        }
    ],
    "breadcrumbs": "2 / 2-1"
    }
    ```

---
## 2.Table 구조
1. **page_id**
    - 페이지의 고유 식별자로서 자동 증가
2. **title**
    - 페이지의 제목을 저장하는 문자열 필드
3. **content**
    - 페이지의 내용을 저장하는 텍스트 필드
4. **parent_page_id**
    - 페이지가 속한 상위 페이지의 page_id를 나타내는 외래 키(Foreign Key)
    - 이를 통해 페이지 간의 계층 구조를 나타낼 수 있다.
5. **FOREIGN KEY (parent_page_id) REFERENCES Pages(page_id)**
    - parent_page_id 필드는 Pages 테이블의 page_id와 외래 키 관계 정의
6. **INDEX parent_page_id_index (parent_page_id)**
    - parent_page_id 필드에 대한 인덱스를 생성
    - 인덱스를 사용하면 검색 및 조인 작업이 빨라진다.

---
## 3. Database ERD
- self relation table 형태
![ERD image](<public/ERD.png>)

---
## 4. 주요 접근 방식
- 페이지와 서브 페이지의 계층 구조를 나타내기 위해 데이터베이스에 트리 구조를 저장하는 것이 효율적 
- 이를 위해 각 페이지는 부모 페이지의 ID를 가지고 있다.

#### 2. **인덱싱**
- 페이지 조회 API의 성능을 향상시키기 위해 데이터베이스에서 적절한 인덱스를 설정
- 페이지 ID와 부모 페이지 ID에 대한 인덱스를 만들어 빠른 조회 가능

#### 3. **재귀 함수 사용하여 bread crumbs 구현**
- 페이지 및 bread crumbs를 검색하는 데 재귀 쿼리를 사용할 수 재귀 함수 사용
##### - **재귀함수**란 ?
```
- 함수가 자기 자신을 호출
- 함수 호출 시 특정 조건을 만족하면 재귀 호출을 중단
- 재귀 호출이 중단될 때까지 함수는 스택에 여러 번 push, pop
```
---
## 5. 결과 회고

#### 1.  나의 코드의 단점 
- **스택 오버플로우 가능성**
    - 만약 깊은 계층 구조를 가졌다면 스택 오버플로우 오류가 발생할 수 있다. 재귀 호출이 많아질수록 발생한다.
- **성능적 단점**  
    - 함수 호출 스택을 생성하고 관리해야하니까 성능 오버헤드가 발생 할 수 있다.
#### 2. 개선 방법 생각해보기
- **쿼리로 가져오는 방법**  
    -  나 조차도 이해하지 못하는 확장성없는 쿼리를 만드는게 맞나 싶었다.
- **캐싱 사용**     
    - 재귀 함수를 사용하여 계층 구조를 탐색할 때 중복된 계산을 피하기 위해 캐싱, 이미 검색한 페이지 정보를 캐싱하여 다시 요청할 때 재귀 호출을 최적화
- **반복 및 재귀 조합**
    -  대규모 데이터 세트의 경우, 일부 경우에는 재귀 대신 반복을 사용하고, 다른 경우에는 재귀를 사용하여 최적의 성능을 얻을 수 있는 방법을 고려할 수 있다.