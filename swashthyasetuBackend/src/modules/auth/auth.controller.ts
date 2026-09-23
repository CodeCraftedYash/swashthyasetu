import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import type { AuthService } from "./auth.service.js";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.authService.register(req.body);
    sendSuccess(res, 201, "User registered successfully", result);
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.authService.login(req.body);
    sendSuccess(res, 200, "Login successful", result);
  });

  refresh = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.body?.refreshToken ?? req.cookies?.refreshToken ?? "";
    const result = await this.authService.refresh(refreshToken);
    sendSuccess(res, 200, "Token refreshed successfully", result);
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.body?.refreshToken ?? req.cookies?.refreshToken ?? "";
    await this.authService.logout(refreshToken);
    sendSuccess(res, 200, "Logged out successfully", null);
  });

  me = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.authService.me(req.user?.userId ?? "");
    sendSuccess(res, 200, "Profile fetched successfully", result);
  });
}
