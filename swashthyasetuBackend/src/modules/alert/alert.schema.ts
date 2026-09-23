import { z } from "zod";

export const alertIdParamSchema = z.object({ id: z.string().min(1) });

export const createAlertSchema = z.object({
  patientId: z.string().optional(),
  reporterUserId: z.string().optional(),
  hospitalId: z.string().optional(),
  ambulanceId: z.string().optional(),
  severity: z.enum(["MODERATE", "SERIOUS", "CRITICAL"]),
  reporter: z.enum(["APP_SOS", "BYSTANDER_CALL", "POLICE", "ASHA_WORKER", "HOSPITAL", "SYSTEM"]),
  note: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const updateAlertStatusSchema = z.object({ status: z.enum(["CREATED", "ACKNOWLEDGED", "AMBULANCE_ASSIGNED", "AMBULANCE_EN_ROUTE", "PATIENT_PICKED_UP", "PATIENT_ADMITTED", "RESOLVED", "CANCELLED"]) });
export const assignAlertSchema = z.object({ ambulanceId: z.string().optional(), hospitalId: z.string().optional(), assignedById: z.string().optional() });
export const createAlertEventSchema = z.object({ status: z.enum(["CREATED", "ACKNOWLEDGED", "AMBULANCE_ASSIGNED", "AMBULANCE_EN_ROUTE", "PATIENT_PICKED_UP", "PATIENT_ADMITTED", "RESOLVED", "CANCELLED"]), note: z.string().optional() });

export type CreateAlertInput = z.infer<typeof createAlertSchema>;
