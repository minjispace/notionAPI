import { getPageInfo } from "./index.js";

// 브로드 크럼스 조회 함수
export function getBreadcrumbs(pageId, db, callback) {
  function getChildBreadcrumbs(pageId, breadcrumbs, callback) {
    getPageInfo(pageId, db, (page) => {
      // page가 있을때
      if (page) {
        breadcrumbs.unshift(page.title);
        if (page.parent_page_id) {
          getChildBreadcrumbs(page.parent_page_id, breadcrumbs, callback);
        } else {
          callback(breadcrumbs);
        }

        // page가 없을 때
      } else {
        callback(breadcrumbs);
      }
    });
  }

  getChildBreadcrumbs(pageId, [], callback);
}
