import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { bedController } from "./bed.index.js";
import { bedIdParamSchema, createBedSchema, hospitalBedParamSchema, updateBedSchema } from "./bed.schema.js";

const router = Router();

router.use(authMiddleware);
router.get("/", bedController.listBeds);
router.get("/summary", bedController.summary);
router.get("/:id", validate({ params: bedIdParamSchema }), bedController.getBed);
router.post("/", validate({ body: createBedSchema }), bedController.createBed);
router.patch("/:id", validate({ params: bedIdParamSchema, body: updateBedSchema }), bedController.updateBed);
router.patch("/hospitals/:hospitalId/beds/:wardType", validate({ params: hospitalBedParamSchema }), bedController.updateWardBed);

export default router;
