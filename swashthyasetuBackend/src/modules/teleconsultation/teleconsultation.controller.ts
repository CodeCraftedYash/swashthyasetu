import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import { TeleconsultationService } from "./teleconsultation.service.js";

export class TeleconsultationController {
  constructor(private readonly teleconsultationService: TeleconsultationService) {}

  createTeleconsultation = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.teleconsultationService.createTeleconsultation(req.body);
    sendSuccess(res, 201, "Teleconsultation created successfully", result);
  });

  listTeleconsultations = asyncHandler(async (_req: Request, res: Response) => {
    const result = await this.teleconsultationService.listTeleconsultations();
    sendSuccess(res, 200, "Teleconsultations fetched successfully", result);
  });

  getTeleconsultation = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.teleconsultationService.getTeleconsultation(id);
    sendSuccess(res, 200, "Teleconsultation fetched successfully", result);
  });

  updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.teleconsultationService.updateStatus(id, req.body.status);
    sendSuccess(res, 200, "Teleconsultation status updated successfully", result);
  });

  updateNotes = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.teleconsultationService.updateNotes(id, req.body);
    sendSuccess(res, 200, "Teleconsultation notes updated successfully", result);
  });
}
