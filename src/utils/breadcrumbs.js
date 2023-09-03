import { db } from "../db.js";
import { getPageInfo } from "./index.js";

// 주어진 페이지 ID를 사용하여 해당 페이지의 부모 페이지의 제목을 조회
// 이를 통해 현재 페이지의 상위 페이지 title 알아내기
async function getParentTitle(pageId) {
  // SQL 쿼리문: 주어진 pageId에 대한 부모 페이지의 제목을 조회
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

// 브로드 크럼스 조회 함수 (재귀적으로 async/await 활용
export async function getBreadcrumbs(pageId, db) {
  async function getChildBreadcrumbs(pageId, breadcrumbs) {
    // 현재 페이지 정보 조회
    const page = await getPageInfo(pageId, db);

    // 페이지 정보가 없는 경우, 그냥 현재 브로드 크럼스를 반환
    if (!page) {
      return breadcrumbs;
    }

    // 부모 페이지의 제목을 조회
    const parentTitle = await getParentTitle(pageId);

    // 부모 페이지의 title을 추가
    if (parentTitle) {
      breadcrumbs.push(parentTitle.trim());
    }

    // 현재 페이지의 title을 추가
    breadcrumbs.push(page.title.trim());

    // 부모 페이지가 존재하는 경우, 재귀적으로 상위 페이지 경로를 조회
    if (page.parent_page_id) {
      return getChildBreadcrumbs(page.parent_page_id, breadcrumbs);
    } else {
      // 최상위 페이지(루트 페이지)에 도달한 경우, 브로드 크럼스를 반환
      return breadcrumbs;
    }
  }

  // getChildBreadcrumbs 함수를 호출하여 브로드 크럼스를 조회하고 반환
  return await getChildBreadcrumbs(pageId, []);
}
