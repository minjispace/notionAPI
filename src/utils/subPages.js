// 서브 페이지 리스트 조회 함수 (Promise 활용)
export function getSubPages(pageId, db) {
  return new Promise((resolve, reject) => {
    // query
    const query = "SELECT page_id, title FROM Pages WHERE parent_page_id = ?";

    // db query
    db.query(query, [pageId], (error, results) => {
      if (error) {
        console.error("❌ getSubPages query error:", error);
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}
