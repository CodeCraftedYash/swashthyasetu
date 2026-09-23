import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { doctorController } from "./doctor.index.js";
import { createDoctorSchema, doctorIdParamSchema, listDoctorsQuerySchema, updateDoctorSchema, updateDoctorStatusSchema } from "./doctor.schema.js";

const router = Router();

router.use(authMiddleware);
router.get("/", validate({ query: listDoctorsQuerySchema }), doctorController.listDoctors);
router.get("/:id", validate({ params: doctorIdParamSchema }), doctorController.getDoctor);
router.post("/", validate({ body: createDoctorSchema }), doctorController.createDoctor);
router.patch("/:id", validate({ params: doctorIdParamSchema, body: updateDoctorSchema }), doctorController.updateDoctor);
router.patch("/:id/status", validate({ params: doctorIdParamSchema, body: updateDoctorStatusSchema }), doctorController.updateStatus);

export default router;
