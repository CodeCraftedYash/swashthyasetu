import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { ambulanceController } from "./ambulance.index.js";
import { ambulanceIdParamSchema, ambulanceLocationSchema, createAmbulanceSchema, updateAmbulanceSchema, updateAmbulanceStatusSchema } from "./ambulance.schema.js";

const router = Router();

router.use(authMiddleware);
router.get("/", ambulanceController.listAmbulances);
router.get("/:id", validate({ params: ambulanceIdParamSchema }), ambulanceController.getAmbulance);
router.post("/", validate({ body: createAmbulanceSchema }), ambulanceController.createAmbulance);
router.patch("/:id", validate({ params: ambulanceIdParamSchema, body: updateAmbulanceSchema }), ambulanceController.updateAmbulance);
router.patch("/:id/status", validate({ params: ambulanceIdParamSchema, body: updateAmbulanceStatusSchema }), ambulanceController.updateStatus);
router.post("/:id/location", validate({ params: ambulanceIdParamSchema, body: ambulanceLocationSchema }), ambulanceController.addLocation);

export default router;
