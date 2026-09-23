import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { appointmentController } from "./appointment.index.js";
import { appointmentIdParamSchema, createAppointmentSchema, updateAppointmentStatusSchema } from "./appointment.schema.js";

const router = Router();

router.use(authMiddleware);
router.post("/", validate({ body: createAppointmentSchema }), appointmentController.createAppointment);
router.get("/", appointmentController.listAppointments);
router.get("/:id", validate({ params: appointmentIdParamSchema }), appointmentController.getAppointment);
router.patch("/:id/status", validate({ params: appointmentIdParamSchema, body: updateAppointmentStatusSchema }), appointmentController.updateStatus);

export default router;
