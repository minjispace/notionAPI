// 주어진 pageId를 사용하여 부모 페이지의 제목을 조회하는 비동기 함수
// 데이터베이스에서 페이지 정보를 검색하고,
// 페이지 계층 구조를 따라 부모 페이지를 재귀적으로 찾아 브로드 크럼스를 생성
async function getParentTitle(pageId, db) {
  // query
  const query = `
    SELECT title, parent_page_id
    FROM Pages
    WHERE page_id = ?
  `;

  return new Promise((resolve, reject) => {
    db.query(query, [pageId], async (error, results) => {
      // SQL 쿼리문 실행에 실패
      if (error) {
        console.error("❌ getParentTitle query error:", error);
        reject(error);
        // SQL 쿼리문 실행에 결과가 0개
      } else if (results.length === 0) {
        resolve(null);
      } else {
        // SQL 쿼리문 실행에 결과가 존재
        // 쿼리 결과에서 부모 페이지의 정보를 추출하고,
        // 부모 페이지가 있는 경우, 재귀적으로 getParentTitle 함수를 호출
        // 부모 페이지의 부모 페이지를 찾아 브로드 크럼스를 구성
        const { title, parent_page_id } = results[0];

        // 부모 페이지가 있는 경우
        if (parent_page_id) {
          // 또 그 부모 페이지를 찾아 브로드 크럼스를 구성
          const parentTitle = await getParentTitle(parent_page_id, db);
          if (parentTitle) {
            resolve(parentTitle + " / " + title.trim());
          } else {
            resolve(title.trim());
          }
          // 부모 페이지가 없는 경우
        } else {
          resolve(title.trim());
        }
      }
    });
  });
}

// 브로드 크럼스 조회 함수
export async function getBreadcrumbs(pageId, db) {
  return await getParentTitle(pageId, db);
}
