import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import { QrCheckInService } from "./qr-checkin.service.js";

export class QrCheckInController {
  constructor(private readonly qrCheckInService: QrCheckInService) {}

  createQrCheckIn = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.qrCheckInService.createQrCheckIn(req.body);
    sendSuccess(res, 201, "QR check-in created successfully", result);
  });

  getByToken = asyncHandler(async (req: Request, res: Response) => {
    const token = String(req.params.token ?? "");
    const result = await this.qrCheckInService.getByToken(token);
    sendSuccess(res, 200, "QR check-in fetched successfully", result);
  });

  scanToken = asyncHandler(async (req: Request, res: Response) => {
    const token = String(req.params.token ?? "");
    const result = await this.qrCheckInService.scanToken(token);
    sendSuccess(res, 200, "QR token scanned successfully", result);
  });

  verifyToken = asyncHandler(async (req: Request, res: Response) => {
    const token = String(req.params.token ?? "");
    const result = await this.qrCheckInService.verifyToken(token);
    sendSuccess(res, 200, "QR token verified successfully", result);
  });

  updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.qrCheckInService.updateStatus(id, req.body.status);
    sendSuccess(res, 200, "QR check-in status updated", result);
  });
}
