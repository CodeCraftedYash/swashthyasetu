import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import { SchemeService } from "./scheme.service.js";

export class SchemeController {
  constructor(private readonly schemeService: SchemeService) {}

  listSchemes = asyncHandler(async (_req: Request, res: Response) => {
    const result = await this.schemeService.listSchemes();
    sendSuccess(res, 200, "Schemes fetched successfully", result);
  });

  getScheme = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.schemeService.getScheme(id);
    sendSuccess(res, 200, "Scheme fetched successfully", result);
  });

  createScheme = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.schemeService.createScheme(req.body);
    sendSuccess(res, 201, "Scheme created successfully", result);
  });

  updateScheme = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.schemeService.updateScheme(id, req.body);
    sendSuccess(res, 200, "Scheme updated successfully", result);
  });

  applyForScheme = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.schemeService.applyForScheme(id, req.body);
    sendSuccess(res, 201, "Scheme application submitted successfully", result);
  });

  getPatientApplications = asyncHandler(async (req: Request, res: Response) => {
    const patientId = String(req.params.patientId ?? "");
    const result = await this.schemeService.getPatientApplications(patientId);
    sendSuccess(res, 200, "Scheme applications fetched successfully", result);
  });

  updateApplicationStatus = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.schemeService.updateApplicationStatus(id, req.body.status);
    sendSuccess(res, 200, "Scheme application status updated successfully", result);
  });
}
