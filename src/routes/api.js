import express from "express";
import { db } from "../db.js";
import { getPageInfo, getBreadcrumbs, getSubPages } from "../utils/index.js";

const router = express.Router();

router.get("/pages/:pageId", async (req, res) => {
  const pageId = req.params.pageId;

  try {
    // get page, subpage, breadcrumbs
    const page = await getPageInfo(pageId, db);
    const subPages = await getSubPages(pageId, db);
    const breadcrumbs = await getBreadcrumbs(pageId, db);

    // page not found throw 404 error
    if (!page) {
      return res.status(404).json({ error: "❌ Page not found" });
    }

    // return page info
    res.status(200).json({
      pageId: page.page_id,
      title: page.title,
      subPages: subPages.map((subPage) => ({
        pageId: subPage.page_id,
        title: subPage.title,
      })),
      breadcrumbs,
    });
  } catch (error) {
    console.error(`❌ Error pagesInfo api route:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
