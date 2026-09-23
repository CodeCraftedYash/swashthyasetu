import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import { TokenService } from "./token.service.js";

export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  createToken = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.tokenService.createToken(req.body);
    sendSuccess(res, 201, "Token created successfully", result);
  });

  getToken = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.tokenService.getToken(id);
    sendSuccess(res, 200, "Token fetched successfully", result);
  });

  updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.tokenService.updateStatus(id, req.body.status);
    sendSuccess(res, 200, "Token status updated successfully", result);
  });

  reserveToken = asyncHandler(async (req: Request, res: Response) => {
    const hospitalId = String(req.params.hospitalId ?? "");
    const result = await this.tokenService.reserveToken(hospitalId, req.body.patientId, req.body.bookedFor, req.body.doctorId);
    sendSuccess(res, 201, "Token reserved successfully", result);
  });
}
