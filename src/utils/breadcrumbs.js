import { getPageInfo } from "./index.js";

// 브로드 크럼스 조회 함수
export function getBreadcrumbs(pageId, db, callback) {
  function getChildBreadcrumbs(pageId, breadcrumbs, callback) {
    const query = "SELECT title, parent_page_id FROM Pages WHERE page_id = ?";

    db.query(query, [pageId], (error, results) => {
      if (error) {
        console.error("MySQL query error:", error);
        callback(breadcrumbs);
        return;
      }
      const page = results[0];
      if (page) {
        breadcrumbs.unshift(page.title);
        if (page.parent_page_id) {
          getChildBreadcrumbs(page.parent_page_id, breadcrumbs, callback);
        } else {
          callback(breadcrumbs);
        }
      } else {
        callback(breadcrumbs);
      }
    });
  }

  getChildBreadcrumbs(pageId, [], callback);
}
