import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import { NotificationService } from "./notification.service.js";

export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  listNotifications = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.notificationService.listNotifications(req.user?.userId ?? "");
    sendSuccess(res, 200, "Notifications fetched successfully", result);
  });

  markRead = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.notificationService.markRead(id);
    sendSuccess(res, 200, "Notification marked as read", result);
  });

  markAllRead = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.notificationService.markAllRead(req.user?.userId ?? "");
    sendSuccess(res, 200, "Notifications marked as read", result);
  });
}
