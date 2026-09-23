import { Router } from "express";
import alertRouter from "../modules/alert/alert.routes.js";
import ambulanceRouter from "../modules/ambulance/ambulance.routes.js";
import appointmentRouter from "../modules/appointment/appointment.routes.js";
import ashaRouter from "../modules/asha/asha.routes.js";
import authRouter from "../modules/auth/auth.routes.js";
import bedRouter from "../modules/bed/bed.routes.js";
import doctorRouter from "../modules/doctor/doctor.routes.js";
import healthRouter from "../modules/health/health.route.js";
import hospitalRouter from "../modules/hospital/hospital.routes.js";
import notificationRouter from "../modules/notification/notification.routes.js";
import qrCheckInRouter from "../modules/qr-checkin/qr-checkin.routes.js";
import schemeRouter from "../modules/scheme/scheme.routes.js";
import severityRouter from "../modules/severity/severity.routes.js";
import teleconsultationRouter from "../modules/teleconsultation/teleconsultation.routes.js";
import tokenRouter from "../modules/token/token.routes.js";
import userRouter from "../modules/user/user.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "API is healthy", data: { status: "ok" } });
});

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/health", healthRouter);
router.use("/hospitals", hospitalRouter);
router.use("/doctors", doctorRouter);
router.use("/ambulances", ambulanceRouter);
router.use("/alerts", alertRouter);
router.use("/beds", bedRouter);
router.use("/appointments", appointmentRouter);
router.use("/tokens", tokenRouter);
router.use("/teleconsultations", teleconsultationRouter);
router.use("/asha", ashaRouter);
router.use("/schemes", schemeRouter);
router.use("/qr-checkins", qrCheckInRouter);
router.use("/notifications", notificationRouter);
router.use("/severity", severityRouter);

export default router;
