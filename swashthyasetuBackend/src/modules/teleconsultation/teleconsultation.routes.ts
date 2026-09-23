import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { teleconsultationController } from "./teleconsultation.index.js";
import { createTeleconsultationSchema, teleconsultationIdParamSchema, updateTeleconsultationNotesSchema, updateTeleconsultationStatusSchema } from "./teleconsultation.schema.js";

const router = Router();

router.use(authMiddleware);
router.post("/", validate({ body: createTeleconsultationSchema }), teleconsultationController.createTeleconsultation);
router.get("/", teleconsultationController.listTeleconsultations);
router.get("/:id", validate({ params: teleconsultationIdParamSchema }), teleconsultationController.getTeleconsultation);
router.patch("/:id/status", validate({ params: teleconsultationIdParamSchema, body: updateTeleconsultationStatusSchema }), teleconsultationController.updateStatus);
router.patch("/:id/notes", validate({ params: teleconsultationIdParamSchema, body: updateTeleconsultationNotesSchema }), teleconsultationController.updateNotes);

export default router;
