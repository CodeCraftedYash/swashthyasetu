import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { hospitalController } from "./hospital.index.js";
import { createHospitalSchema, hospitalIdParamSchema, hospitalQuerySchema, updateHospitalSchema } from "./hospital.schema.js";

const router = Router();

router.use(authMiddleware);
router.get("/", validate({ query: hospitalQuerySchema }), hospitalController.listHospitals);
router.get("/:id", validate({ params: hospitalIdParamSchema }), hospitalController.getHospital);
router.post("/", validate({ body: createHospitalSchema }), hospitalController.createHospital);
router.patch("/:id", validate({ params: hospitalIdParamSchema, body: updateHospitalSchema }), hospitalController.updateHospital);

export default router;
