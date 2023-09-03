// 페이지 정보 조회 함수 (Promise 활용)
export function getPageInfo(pageId, db) {
  return new Promise((resolve, reject) => {
    const query = "SELECT page_id, title FROM Pages WHERE page_id = ?";
    db.query(query, [pageId], (error, results) => {
      if (error) {
        console.error("❌ getPageInfo query error:", error);
        reject(error);
      } else if (results.length === 0) {
        resolve(null);
      } else {
        resolve(results[0]);
      }
    });
  });
}
