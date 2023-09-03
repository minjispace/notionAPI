import { getPageInfo } from "./index.js";

// 브로드 크럼스 조회 함수 (재귀적으로 async/await 활용)
export async function getChildBreadcrumbs(pageId, db, breadcrumbs = []) {
  try {
    const page = await getPageInfo(pageId, db);
    if (page) {
      breadcrumbs.unshift(page.title);
      if (page.parent_page_id) {
        return await getChildBreadcrumbs(page.parent_page_id, db, breadcrumbs);
      }
    }
    return breadcrumbs;
  } catch (error) {
    console.error("❌ Error in getChildBreadcrumbs function:", error);
    return breadcrumbs;
  }
}
