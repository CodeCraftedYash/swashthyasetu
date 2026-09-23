import { z } from "zod";

export const bedIdParamSchema = z.object({ id: z.string().min(1) });
export const hospitalBedParamSchema = z.object({ hospitalId: z.string().min(1), wardType: z.string().min(1) });

export const createBedSchema = z.object({
  hospitalId: z.string().min(1),
  wardType: z.enum(["GENERAL", "ICU", "VENTILATOR", "PEDIATRIC", "MATERNITY", "ISOLATION", "NICU"]),
  totalBeds: z.number().int().min(0),
  occupiedBeds: z.number().int().min(0).optional(),
});

export const updateBedSchema = createBedSchema.partial();
export type CreateBedInput = z.infer<typeof createBedSchema>;
export type UpdateBedInput = z.infer<typeof updateBedSchema>;
