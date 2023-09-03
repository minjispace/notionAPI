import express from "express";
import { getPageInfo, getBreadcrumbs, getSubPages } from "../utils/index.js";
import { db } from "../db/index.js";

const router = express.Router();

router.get("/pages/:pageId", (req, res) => {
  // get pageId
  const pageId = req.params.pageId;

  getPageInfo(pageId, db, (page) => {
    if (!page) {
      return res.status(404).json({ error: "Page not found" });
    }

    getSubPages(pageId, db, (subPages) => {
      getBreadcrumbs(pageId, db, (breadcrumbs) => {
        // 브로드 크럼스 배열을  띄어쓰기 없애고, 문자열로 변환
        const breadcrumbsString = breadcrumbs
          .map((crumb) => crumb.trim())
          .join(" / ");

        // return page info
        res.status(200).json({
          pageId: page.page_id,
          title: page.title,
          subPages: subPages.map((subPage) => ({
            pageId: subPage.page_id,
            title: subPage.title,
          })),
          breadcrumbs: breadcrumbsString,
        });
      });
    });
  });
});

export default router;
