import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { ashaController } from "./asha.index.js";
import { householdIdParamSchema, householdSchema, taskIdParamSchema, taskSchema, updateTaskStatusSchema } from "./asha.schema.js";

const router = Router();

router.use(authMiddleware);
router.get("/tasks", ashaController.listTasks);
router.post("/tasks", validate({ body: taskSchema }), ashaController.createTask);
router.get("/tasks/:id", validate({ params: taskIdParamSchema }), ashaController.getTask);
router.patch("/tasks/:id", validate({ params: taskIdParamSchema, body: taskSchema.partial() }), ashaController.updateTask);
router.patch("/tasks/:id/status", validate({ params: taskIdParamSchema, body: updateTaskStatusSchema }), ashaController.updateStatus);
router.get("/households", ashaController.listHouseholds);
router.post("/households", validate({ body: householdSchema }), ashaController.createHousehold);
router.get("/households/:id", validate({ params: householdIdParamSchema }), ashaController.getHousehold);
router.patch("/households/:id", validate({ params: householdIdParamSchema, body: householdSchema.partial() }), ashaController.updateHousehold);

export default router;
