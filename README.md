# notion API

### 1. 실행 방법 참고
1. **Git clone **
```
git clone https://github.com/minjispace/notionAPI.git
```

2. **Nodemodules install**
```
yarn 
  or
npm i
```
3. **Docker compose**
- docker 켜기
- docker compose up
```
docker compose up
```
4. **Create database**
    - query.sql 코드 참고해서 database 생성 (CREATE TABLE Pages)

5. **Insert test data**
    - query.sql 코드 참고해서 data 넣기 (INSERT INTO Pages)

6. **Server start**
```
yarn start 
    or
npm run start
```
7. **Postman Test**
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


### 2.Table 구조
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

### 3. Database ERD
![ERD image](<public/ERD.png>)

## 4. 주요 접근 방식
1. **트리 구조 데이터베이스 사용**
    - 페이지와 서브 페이지의 계층 구조를 나타내기 위해 데이터베이스에 트리 구조를 저장하는 것이 효율적 
    - 이를 위해 각 페이지는 부모 페이지의 ID를 가지고 있다.

2. **인덱싱**
    - 페이지 조회 API의 성능을 향상시키기 위해 데이터베이스에서 적절한 인덱스를 설정
    - 페이지 ID와 부모 페이지 ID에 대한 인덱스를 만들어 빠른 조회 가능

3. **재귀 쿼리 사용하여 bread crumbs 구현**
    - 페이지 및 bread crumbs를 검색하는 데 재귀 쿼리를 사용할 수 재귀 함수 사용
    - **재귀함수**란 ?
        ```
        - 함수가 자기 자신을 호출
        - 함수 호출 시 특정 조건을 만족하면 재귀 호출을 중단
        - 재귀 호출이 중단될 때까지 함수는 스택에 여러 번 push, pop
        ```
    1. **getParentTitle 함수**
        - 함수가 호출되면 주어진 pageId를 사용하여 부모 페이지의 제목을 조회
        - 만약 부모 페이지가 없거나 (탈출 조건), 부모 페이지의 제목을 찾지 못하면 null 반환
        - 그렇지 않으면, 부모 페이지의 제목을 찾았으므로 이를 반환
        - 또 다시 getParentTitle 함수를 호출하여 부모의 부모 페이지를 찾을 수 있도록    재귀적으로 진행
        - 이런 식으로 계속해서 부모 페이지의 부모 페이지를 찾아간다.
    2. **getBreadcrumbs 함수**
        - 이 함수는 주어진 pageId에 대한 페이지의 브로드 크럼스(경로)를 조회
        - getChildBreadcrumbs라는 내부 함수를 선언하여 재귀적으로 브로드 크럼스를 생성
        - 먼저 현재 페이지 정보를 조회하고, 이 페이지 정보에 대한 부모 페이지의 제목을 가져온다.
        - 현재 페이지와 부모 페이지의 제목을 브로드 크럼스 배열에 추가
        - 만약 부모 페이지가 존재한다면, 해당 부모 페이지의 pageId로 재귀 호출하여 상위 페이지의 경로를 계속해서 구성
        - 더 이상 상위 페이지가 없으면 최상위 페이지(루트 페이지)까지 도달한 것으로 간주하고 브로드 크럼스를 반환
    3. **최종**
        - 최종적으로 getBreadcrumbs 함수는 getChildBreadcrumbs 함수를 호출하여 브로드 크럼스를 조회하고 반환