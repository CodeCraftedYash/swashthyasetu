import { Router } from "express";
import { authController } from "./auth.index.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { loginSchema, logoutSchema, refreshSchema, registerSchema } from "./auth.schema.js";

const router = Router();

router.post("/register", validate({ body: registerSchema }), authController.register);
router.post("/login", validate({ body: loginSchema }), authController.login);
router.post("/refresh", validate({ body: refreshSchema }), authController.refresh);
router.post("/logout", validate({ body: logoutSchema }), authMiddleware, authController.logout);
router.get("/me", authMiddleware, authController.me);

export default router;
