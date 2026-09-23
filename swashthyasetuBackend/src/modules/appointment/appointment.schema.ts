import { z } from "zod";

export const appointmentIdParamSchema = z.object({ id: z.string().min(1) });
export const createAppointmentSchema = z.object({
  patientId: z.string().min(1),
  doctorId: z.string().optional(),
  hospitalId: z.string().min(1),
  assessmentId: z.string().optional(),
  type: z.enum(["IN_PERSON", "TELECONSULTATION", "EMERGENCY"]),
  status: z.enum(["REQUESTED", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "NO_SHOW"]).optional(),
  scheduledAt: z.string().datetime().optional(),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

export const updateAppointmentStatusSchema = z.object({ status: z.enum(["REQUESTED", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "NO_SHOW"]) });

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
