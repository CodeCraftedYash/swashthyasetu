import { z } from "zod";

export const qrTokenParamSchema = z.object({ token: z.string().min(1) });
export const qrCheckInIdParamSchema = z.object({ id: z.string().min(1) });

export const createQrCheckInSchema = z.object({
  patientId: z.string().optional(),
  hospitalId: z.string().min(1),
  deskName: z.string().optional(),
  expiresAt: z.string().datetime(),
});

export const updateQrCheckInStatusSchema = z.object({ status: z.enum(["CREATED", "SCANNED", "VERIFIED", "EXPIRED", "CANCELLED"]) });

export type CreateQrCheckInInput = z.infer<typeof createQrCheckInSchema>;
