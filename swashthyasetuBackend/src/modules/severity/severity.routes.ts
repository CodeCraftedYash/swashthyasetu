import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { severityController } from "./severity.index.js";
import { assessmentIdParamSchema, createAssessmentSchema, patientIdParamSchema } from "./severity.schema.js";

const router = Router();

router.use(authMiddleware);
router.get("/symptoms", severityController.listSymptoms);
router.post("/assessments", validate({ body: createAssessmentSchema }), severityController.createAssessment);
router.get("/assessments/:id", validate({ params: assessmentIdParamSchema }), severityController.getAssessment);
router.get("/patients/:patientId/severity-assessments", validate({ params: patientIdParamSchema }), severityController.getPatientAssessments);

export default router;
