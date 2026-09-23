import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import { AmbulanceService } from "./ambulance.service.js";

export class AmbulanceController {
  constructor(private readonly ambulanceService: AmbulanceService) {}

  listAmbulances = asyncHandler(async (_req: Request, res: Response) => {
    const result = await this.ambulanceService.listAmbulances();
    sendSuccess(res, 200, "Ambulances fetched successfully", result);
  });

  getAmbulance = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.ambulanceService.getAmbulanceById(id);
    sendSuccess(res, 200, "Ambulance fetched successfully", result);
  });

  createAmbulance = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.ambulanceService.createAmbulance(req.body);
    sendSuccess(res, 201, "Ambulance created successfully", result);
  });

  updateAmbulance = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.ambulanceService.updateAmbulance(id, req.body);
    sendSuccess(res, 200, "Ambulance updated successfully", result);
  });

  updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.ambulanceService.updateStatus(id, req.body.status);
    sendSuccess(res, 200, "Ambulance status updated successfully", result);
  });

  addLocation = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.ambulanceService.addLocation(id, req.body.latitude, req.body.longitude);
    sendSuccess(res, 201, "Ambulance location recorded", result);
  });
}
