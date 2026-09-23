import { z } from "zod";

export const hospitalIdParamSchema = z.object({ id: z.string().min(1) });

export const hospitalQuerySchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  level: z.string().optional(),
  district: z.string().optional(),
  specialty: z.string().optional(),
  availableOnly: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export const createHospitalSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  area: z.string().min(1),
  address: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  phone: z.string().optional(),
  level: z.enum(["LEVEL_I_TRAUMA", "LEVEL_II", "LEVEL_III"]),
  status: z.enum(["AVAILABLE", "BUSY", "FULL", "CLOSED"]).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const updateHospitalSchema = createHospitalSchema.partial();
export type CreateHospitalInput = z.infer<typeof createHospitalSchema>;
export type UpdateHospitalInput = z.infer<typeof updateHospitalSchema>;
