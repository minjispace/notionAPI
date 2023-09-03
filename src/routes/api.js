import express from "express";
import { db } from "../db/index.js";
import {
  getPageInfo,
  getChildBreadcrumbs,
  getSubPages,
} from "../utils/index.js";

const router = express.Router();

router.get("/pages/:pageId", async (req, res) => {
  const pageId = req.params.pageId;

  try {
    // getPageInfo
    const page = await getPageInfo(pageId, db);

    // page not found throw 404 error
    if (!page) {
      return res.status(404).json({ error: "Page not found" });
    }

    // get subPages
    const subPages = await getSubPages(pageId, db);

    // get breadcrumbs
    const breadcrumbs = await getChildBreadcrumbs(pageId, db);

    // convert breadcrumbs to string
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
  } catch (error) {
    console.error(`❌ Error pagesInfo api route:`, error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
