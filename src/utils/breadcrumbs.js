import { db } from "../db.js";
import { getPageInfo } from "./index.js";

// 브로드 크럼스 조회 함수 (재귀적으로 async/await 활용)
async function getParentTitle(pageId) {
  const query = `
    SELECT title
    FROM Pages
    WHERE page_id = (SELECT parent_page_id FROM Pages WHERE page_id = ?)
  `;

  return new Promise((resolve, reject) => {
    db.query(query, [pageId], (error, results) => {
      if (error) {
        console.error("❌ getParentTitle query error:", error);
        reject(error);
      } else if (results.length === 0) {
        resolve(null);
      } else {
        resolve(results[0].title);
      }
    });
  });
}

export async function getBreadcrumbs(pageId, db) {
  async function getChildBreadcrumbs(pageId, breadcrumbs) {
    const page = await getPageInfo(pageId, db);

    if (!page) {
      return breadcrumbs;
    }

    const parentTitle = await getParentTitle(pageId);

    if (parentTitle) {
      breadcrumbs.push(parentTitle.trim()); // 부모 페이지의 title을 추가
    }

    breadcrumbs.push(page.title.trim()); // 현재 페이지의 title을 추가

    if (page.parent_page_id) {
      return getChildBreadcrumbs(page.parent_page_id, breadcrumbs);
    } else {
      return breadcrumbs;
    }
  }

  return await getChildBreadcrumbs(pageId, []);
}
