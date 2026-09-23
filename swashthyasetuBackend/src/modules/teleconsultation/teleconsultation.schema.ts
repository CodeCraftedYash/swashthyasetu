import { z } from "zod";

export const teleconsultationIdParamSchema = z.object({ id: z.string().min(1) });

export const createTeleconsultationSchema = z.object({
  patientId: z.string().min(1),
  doctorId: z.string().optional(),
  hospitalId: z.string().optional(),
  appointmentId: z.string().optional(),
  status: z.enum(["REQUESTED", "SCHEDULED", "WAITING", "IN_PROGRESS", "COMPLETED", "CANCELLED", "NO_SHOW"]).optional(),
  scheduledAt: z.string().datetime().optional(),
  patientNotes: z.string().optional(),
  doctorNotes: z.string().optional(),
  summary: z.string().optional(),
});

export const updateTeleconsultationStatusSchema = z.object({ status: z.enum(["REQUESTED", "SCHEDULED", "WAITING", "IN_PROGRESS", "COMPLETED", "CANCELLED", "NO_SHOW"]) });
export const updateTeleconsultationNotesSchema = z.object({ doctorNotes: z.string().optional(), patientNotes: z.string().optional() });

export type CreateTeleconsultationInput = z.infer<typeof createTeleconsultationSchema>;
