import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import { AppointmentService } from "./appointment.service.js";

export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  createAppointment = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.appointmentService.createAppointment(req.body);
    sendSuccess(res, 201, "Appointment created successfully", result);
  });

  listAppointments = asyncHandler(async (_req: Request, res: Response) => {
    const result = await this.appointmentService.listAppointments();
    sendSuccess(res, 200, "Appointments fetched successfully", result);
  });

  getAppointment = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.appointmentService.getAppointment(id);
    sendSuccess(res, 200, "Appointment fetched successfully", result);
  });

  updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const id = String(req.params.id ?? "");
    const result = await this.appointmentService.updateStatus(id, req.body.status);
    sendSuccess(res, 200, "Appointment status updated successfully", result);
  });
}
