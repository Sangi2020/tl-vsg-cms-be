import express from "express";

import authRoutes from "./auth.routes.js";
import blogRoutes from "./blog.routes.js";
import serviceRoutes from "./service.routes.js";
import enquiriesRoutes from "./enquiries.routes.js";
import contentsRoutes from "./contents.routes.js";
import teamRoutes from "./team.routes.js";
import qnaRoutes from "./qna.routes.js";
import newsletterRoutes from "./newsletter.routes.js";
import socialRoutes from "./social.routes.js";
import statRoutes from "./stat.routes.js";
import emailConfigRoutes from "./emailConfig.routes.js";
import notificationRoutes from "./notification.routes.js";
import documentRoutes from "./document.routes.js"
import userRoutes from "./user.routes.js"
import seoRoutes from "./seo.routes.js"
import settingRoutes from "./settings.routes.js"
import companySettingRoutes from "./companySetting.routes.js"
import caseStudyRoute from "./caseStudyRoute.js"
import careerRoute from "./careerRoute.js"
import youtubeVideoRoute from "./youtubeVideo.route.js"



const router = express.Router();

router.use("/auth", authRoutes);
router.use("/blog", blogRoutes);
router.use("/service", serviceRoutes);
router.use("/team", teamRoutes);
router.use("/enquiries", enquiriesRoutes);
router.use("/contents", contentsRoutes);
router.use("/qna", qnaRoutes);
router.use("/newsletter", newsletterRoutes);
router.use('/social', socialRoutes);
router.use('/config', emailConfigRoutes);
router.use('/notification', notificationRoutes);
router.use('/document', documentRoutes)
router.use('/users', userRoutes);
router.use("/stats", statRoutes);
router.use("/seo",seoRoutes)
router.use("/settings",settingRoutes);
router.use("/company",companySettingRoutes);
router.use("/casestudy",caseStudyRoute);
router.use("/career",careerRoute);
router.use("/youtube",youtubeVideoRoute);


export default router;