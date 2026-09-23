import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import { AlertService } from "./alert.service.js";

export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  listAlerts = asyncHandler(async (_req: Request, res: Response) => {
    const result = await this.alertService.listAlerts();
    sendSuccess(res, 200, "Alerts fetched successfully", result);
  });

  getAlert = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.alertService.getAlertById(id);
    sendSuccess(res, 200, "Alert fetched successfully", result);
  });

  createAlert = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.alertService.createAlert(req.body);
    sendSuccess(res, 201, "Alert created successfully", result);
  });

  updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.alertService.updateStatus(id, req.body.status);
    sendSuccess(res, 200, "Alert status updated successfully", result);
  });

  assignAlert = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.alertService.assignAlert(id, req.body);
    sendSuccess(res, 200, "Alert assigned successfully", result);
  });

  createEvent = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.alertService.createEvent(id, req.body);
    sendSuccess(res, 201, "Alert event created successfully", result);
  });

  listEvents = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.alertService.listEvents(id);
    sendSuccess(res, 200, "Alert events fetched successfully", result);
  });
}
