import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import { DoctorService } from "./doctor.service.js";

export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  listDoctors = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.doctorService.listDoctors(req.query as Record<string, string | undefined>);
    sendSuccess(res, 200, "Doctors fetched successfully", result);
  });

  getDoctor = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.doctorService.getDoctorById(id);
    sendSuccess(res, 200, "Doctor fetched successfully", result);
  });

  createDoctor = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.doctorService.createDoctor(req.body);
    sendSuccess(res, 201, "Doctor created successfully", result);
  });

  updateDoctor = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.doctorService.updateDoctor(id, req.body);
    sendSuccess(res, 200, "Doctor updated successfully", result);
  });

  updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.doctorService.updateStatus(id, req.body.status);
    sendSuccess(res, 200, "Doctor status updated successfully", result);
  });
}
