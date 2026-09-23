import { Router } from "express";
import router from "../route/index.js";

const rootRouter = Router();

rootRouter.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "SwashthyaSetu API is running",
    version: "1.0.0",
  });
});

rootRouter.use("/api", router);

export default rootRouter;
