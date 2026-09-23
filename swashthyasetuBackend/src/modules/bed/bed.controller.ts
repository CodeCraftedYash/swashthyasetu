import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import { BedService } from "./bed.service.js";

export class BedController {
  constructor(private readonly bedService: BedService) {}

  listBeds = asyncHandler(async (_req: Request, res: Response) => {
    const result = await this.bedService.listBeds();
    sendSuccess(res, 200, "Beds fetched successfully", result);
  });

  getBed = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.bedService.getBedById(id);
    sendSuccess(res, 200, "Bed fetched successfully", result);
  });

  createBed = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.bedService.createBed(req.body);
    sendSuccess(res, 201, "Bed inventory created successfully", result);
  });

  updateBed = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.bedService.updateBed(id, req.body);
    sendSuccess(res, 200, "Bed inventory updated successfully", result);
  });

  updateWardBed = asyncHandler(async (req: Request, res: Response) => {
    const hospitalId = String(req.params.hospitalId ?? "");
    const wardType = String(req.params.wardType ?? "");
    const result = await this.bedService.updateWardBed(hospitalId, wardType, req.body);
    sendSuccess(res, 200, "Ward bed inventory updated successfully", result);
  });

  summary = asyncHandler(async (_req: Request, res: Response) => {
    const result = await this.bedService.summary();
    sendSuccess(res, 200, "Bed summary fetched successfully", result);
  });
}
