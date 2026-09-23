import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import { HospitalService } from "./hospital.service.js";

export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  listHospitals = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.hospitalService.getHospitals(req.query as Record<string, string | undefined>);
    sendSuccess(res, 200, "Hospitals fetched successfully", result);
  });

  getHospital = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.hospitalService.getHospitalById(id);
    sendSuccess(res, 200, "Hospital fetched successfully", result);
  });

  createHospital = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.hospitalService.createHospital(req.body);
    sendSuccess(res, 201, "Hospital created successfully", result);
  });

  updateHospital = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.hospitalService.updateHospital(id, req.body);
    sendSuccess(res, 200, "Hospital updated successfully", result);
  });
}
