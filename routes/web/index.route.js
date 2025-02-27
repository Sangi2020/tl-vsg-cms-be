import express from "express";

import blogRoutes from "./blog.routes.js";
import enquiriesRoutes from "./enquiries.routes.js";
import contentsRoutes from "./contents.routes.js";
import teamRoutes from "./team.routes.js";
import qnaRoutes from "./qna.routes.js";
import clientRoutes from "./client.routes.js";
import catalogueRoutes from "./catalogue.routes.js";
import newsletterRoutes from "./newsletter.routes.js";
import socialRoutes from "./social.routes.js";
import seoRoutes from "./seo.routes.js";


const router = express.Router();

router.use("/blog", blogRoutes);
router.use("/team", teamRoutes);
router.use("/enquiries", enquiriesRoutes);
router.use("/contents", contentsRoutes);
router.use("/client", clientRoutes);
router.use("/qna", qnaRoutes);
router.use("/catalogue", catalogueRoutes);
router.use("/newsletter", newsletterRoutes);
router.use('/social', socialRoutes);
router.use('/seo', seoRoutes)


export default router;