import { z } from "zod";

export const tokenIdParamSchema = z.object({ id: z.string().min(1) });

export const createTokenSchema = z.object({
  patientId: z.string().min(1),
  hospitalId: z.string().min(1),
  doctorId: z.string().optional(),
  bookedFor: z.string().datetime(),
  appointmentId: z.string().optional(),
});

export const updateTokenStatusSchema = z.object({ status: z.enum(["BOOKED", "CHECKED_IN", "SERVING", "COMPLETED", "CANCELLED", "MISSED"]) });

export type CreateTokenInput = z.infer<typeof createTokenSchema>;
