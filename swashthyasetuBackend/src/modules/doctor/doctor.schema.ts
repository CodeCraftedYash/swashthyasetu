import { z } from "zod";

export const doctorIdParamSchema = z.object({ id: z.string().min(1) });
export const listDoctorsQuerySchema = z.object({
  hospitalId: z.string().optional(),
  status: z.string().optional(),
  specialty: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export const createDoctorSchema = z.object({
  userId: z.string().optional(),
  hospitalId: z.string().min(1),
  name: z.string().min(1),
  department: z.string().min(1),
  licenseNumber: z.string().optional(),
  status: z.enum(["AVAILABLE", "BUSY", "IN_SURGERY", "ON_LEAVE", "OFFLINE"]).optional(),
});

export const updateDoctorSchema = createDoctorSchema.partial();
export const updateDoctorStatusSchema = z.object({ status: z.enum(["AVAILABLE", "BUSY", "IN_SURGERY", "ON_LEAVE", "OFFLINE"]) });

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;
export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>;
