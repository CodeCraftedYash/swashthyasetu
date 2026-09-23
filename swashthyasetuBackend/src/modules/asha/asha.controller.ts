import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import { AshaService } from "./asha.service.js";

export class AshaController {
  constructor(private readonly ashaService: AshaService) {}

  listTasks = asyncHandler(async (_req: Request, res: Response) => {
    const result = await this.ashaService.listTasks();
    sendSuccess(res, 200, "ASHA tasks fetched successfully", result);
  });

  createTask = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.ashaService.createTask(req.body);
    sendSuccess(res, 201, "ASHA task created successfully", result);
  });

  getTask = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.ashaService.getTask(id);
    sendSuccess(res, 200, "ASHA task fetched successfully", result);
  });

  updateTask = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.ashaService.updateTask(id, req.body);
    sendSuccess(res, 200, "ASHA task updated successfully", result);
  });

  updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.ashaService.updateStatus(id, req.body.status);
    sendSuccess(res, 200, "ASHA task status updated successfully", result);
  });

  listHouseholds = asyncHandler(async (_req: Request, res: Response) => {
    const result = await this.ashaService.listHouseholds();
    sendSuccess(res, 200, "Households fetched successfully", result);
  });

  createHousehold = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.ashaService.createHousehold(req.body);
    sendSuccess(res, 201, "Household created successfully", result);
  });

  getHousehold = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.ashaService.getHousehold(id);
    sendSuccess(res, 200, "Household fetched successfully", result);
  });

  updateHousehold = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.ashaService.updateHousehold(id, req.body);
    sendSuccess(res, 200, "Household updated successfully", result);
  });
}
