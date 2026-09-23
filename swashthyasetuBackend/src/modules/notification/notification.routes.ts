import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { notificationController } from "./notification.index.js";
import { notificationIdParamSchema } from "./notification.schema.js";

const router = Router();

router.use(authMiddleware);
router.get("/", notificationController.listNotifications);
router.patch("/:id/read", validate({ params: notificationIdParamSchema }), notificationController.markRead);
router.patch("/read-all", notificationController.markAllRead);

export default router;
