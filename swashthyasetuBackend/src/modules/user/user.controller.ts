import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import { UserService } from "./user.service.js";

export class UserController {
  constructor(private readonly userService: UserService) {}

  getUser = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.userService.getUser(id);
    sendSuccess(res, 200, "User fetched successfully", result);
  });

  updateUser = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.userService.updateUser(id, req.body);
    sendSuccess(res, 200, "User updated successfully", result);
  });

  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.userService.getProfile(id);
    sendSuccess(res, 200, "User profile fetched successfully", result);
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.userService.updateProfile(id, req.body);
    sendSuccess(res, 200, "User profile updated successfully", result);
  });
}
