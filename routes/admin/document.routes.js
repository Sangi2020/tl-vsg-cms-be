import express from "express"
import { createDocument, getDocumentByType } from "../../controllers/document.controller.js"
import verifyJwtToken from "../../middlewares/verifyJwtToken.js"


const router =express.Router()

router.use(verifyJwtToken)

router.get("/:type",getDocumentByType)
router.post("/create-document",createDocument)

export default router