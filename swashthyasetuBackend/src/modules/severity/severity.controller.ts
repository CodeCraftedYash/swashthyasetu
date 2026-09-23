import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import { SeverityService } from "./severity.service.js";

export class SeverityController {
  constructor(private readonly severityService: SeverityService) {}

  listSymptoms = asyncHandler(async (_req: Request, res: Response) => {
    const result = await this.severityService.listSymptoms();
    sendSuccess(res, 200, "Symptoms fetched successfully", result);
  });

  createAssessment = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.severityService.createAssessment(req.body);
    sendSuccess(res, 201, "Assessment created successfully", result);
  });

  getAssessment = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.severityService.getAssessment(id);
    sendSuccess(res, 200, "Assessment fetched successfully", result);
  });

  getPatientAssessments = asyncHandler(async (req: Request, res: Response) => {
    const patientId = String(req.params.patientId ?? "");
    const result = await this.severityService.getPatientAssessments(patientId);
    sendSuccess(res, 200, "Patient assessments fetched successfully", result);
  });
}
