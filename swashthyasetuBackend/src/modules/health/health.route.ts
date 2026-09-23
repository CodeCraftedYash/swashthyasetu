import { Response, Router } from "express";


const healthRouter = Router();

healthRouter.get("/", (_,res:Response)=>{
    res.status(201).json({
        success: true,
        message:"Server is live",
    })
})

export default healthRouter;