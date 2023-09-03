// 페이지 정보 조회 함수
export function getPageInfo(pageId, db, callback) {
  const query = `SELECT * FROM Pages WHERE page_id = ?`;

  db.query(query, [pageId], (error, results) => {
    if (error) {
      console.error("MySQL query error:", error);
      callback(null);
    } else if (results.length === 0) {
      callback(null);
    } else {
      const page = results[0];
      callback(page);
    }
  });
}
