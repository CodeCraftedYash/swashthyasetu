import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { schemeController } from "./scheme.index.js";
import { applySchemeSchema, createSchemeSchema, patientIdParamSchema, schemeApplicationIdParamSchema, schemeIdParamSchema, updateApplicationStatusSchema, updateSchemeStatusSchema } from "./scheme.schema.js";

const router = Router();

router.use(authMiddleware);
router.get("/", schemeController.listSchemes);
router.get("/:id", validate({ params: schemeIdParamSchema }), schemeController.getScheme);
router.post("/", validate({ body: createSchemeSchema }), schemeController.createScheme);
router.patch("/:id", validate({ params: schemeIdParamSchema, body: createSchemeSchema.partial() }), schemeController.updateScheme);
router.post("/:id/applications", validate({ params: schemeIdParamSchema, body: applySchemeSchema }), schemeController.applyForScheme);
router.get("/patients/:patientId/scheme-applications", validate({ params: patientIdParamSchema }), schemeController.getPatientApplications);
router.patch("/scheme-applications/:id/status", validate({ params: schemeApplicationIdParamSchema, body: updateApplicationStatusSchema }), schemeController.updateApplicationStatus);

export default router;
