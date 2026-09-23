import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { alertController } from "./alert.index.js";
import { alertIdParamSchema, assignAlertSchema, createAlertEventSchema, createAlertSchema, updateAlertStatusSchema } from "./alert.schema.js";

const router = Router();

router.use(authMiddleware);
router.post("/", validate({ body: createAlertSchema }), alertController.createAlert);
router.get("/", alertController.listAlerts);
router.get("/:id", validate({ params: alertIdParamSchema }), alertController.getAlert);
router.patch("/:id/status", validate({ params: alertIdParamSchema, body: updateAlertStatusSchema }), alertController.updateStatus);
router.patch("/:id/assign", validate({ params: alertIdParamSchema, body: assignAlertSchema }), alertController.assignAlert);
router.post("/:id/events", validate({ params: alertIdParamSchema, body: createAlertEventSchema }), alertController.createEvent);
router.get("/:id/events", validate({ params: alertIdParamSchema }), alertController.listEvents);

export default router;
