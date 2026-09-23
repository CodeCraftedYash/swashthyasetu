import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { qrCheckInController } from "./qr-checkin.index.js";
import { createQrCheckInSchema, qrCheckInIdParamSchema, qrTokenParamSchema, updateQrCheckInStatusSchema } from "./qr-checkin.schema.js";

const router = Router();

router.use(authMiddleware);
router.post("/", validate({ body: createQrCheckInSchema }), qrCheckInController.createQrCheckIn);
router.get("/:token", validate({ params: qrTokenParamSchema }), qrCheckInController.getByToken);
router.post("/:token/scan", validate({ params: qrTokenParamSchema }), qrCheckInController.scanToken);
router.post("/:token/verify", validate({ params: qrTokenParamSchema }), qrCheckInController.verifyToken);
router.patch("/:id/status", validate({ params: qrCheckInIdParamSchema, body: updateQrCheckInStatusSchema }), qrCheckInController.updateStatus);

export default router;
