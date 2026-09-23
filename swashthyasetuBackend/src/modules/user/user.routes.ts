import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { userController } from "./user.index.js";
import { updateUserSchema, profileSchema, userIdParamSchema } from "./user.schema.js";

const router = Router();

router.use(authMiddleware);
router.get("/:id", validate({ params: userIdParamSchema }), userController.getUser);
router.patch("/:id", validate({ params: userIdParamSchema, body: updateUserSchema }), userController.updateUser);
router.get("/:id/profile", validate({ params: userIdParamSchema }), userController.getProfile);
router.patch("/:id/profile", validate({ params: userIdParamSchema, body: profileSchema }), userController.updateProfile);

export default router;
