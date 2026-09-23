import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { tokenController } from "./token.index.js";
import { createTokenSchema, tokenIdParamSchema, updateTokenStatusSchema } from "./token.schema.js";

const router = Router();

router.use(authMiddleware);
router.post("/", validate({ body: createTokenSchema }), tokenController.createToken);
router.get("/:id", validate({ params: tokenIdParamSchema }), tokenController.getToken);
router.patch("/:id/status", validate({ params: tokenIdParamSchema, body: updateTokenStatusSchema }), tokenController.updateStatus);
router.post("/hospitals/:hospitalId/tokens/reserve", tokenController.reserveToken);

export default router;
