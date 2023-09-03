// 서브 페이지 리스트 조회 함수
export function getSubPages(pageId, db, callback) {
  const query = "SELECT page_id, title FROM Pages WHERE parent_page_id = ?";

  db.query(query, [pageId], (error, results) => {
    if (error) {
      console.error("MySQL query error:", error);
      callback([]);
    } else {
      callback(results);
    }
  });
}
