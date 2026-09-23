import { z } from "zod";

export const ambulanceIdParamSchema = z.object({ id: z.string().min(1) });

export const createAmbulanceSchema = z.object({
  id: z.string().min(1),
  registrationNo: z.string().optional(),
  driverName: z.string().min(1),
  driverPhone: z.string().optional(),
  type: z.enum(["ALS", "BLS"]),
  baseStation: z.string().min(1),
  status: z.enum(["IDLE", "DISPATCHED", "EN_ROUTE", "AT_SCENE", "TRANSPORTING", "ARRIVED", "OUT_OF_SERVICE"]).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  hospitalId: z.string().optional(),
});

export const updateAmbulanceSchema = createAmbulanceSchema.partial();
export const updateAmbulanceStatusSchema = z.object({ status: z.enum(["IDLE", "DISPATCHED", "EN_ROUTE", "AT_SCENE", "TRANSPORTING", "ARRIVED", "OUT_OF_SERVICE"]) });
export const ambulanceLocationSchema = z.object({ latitude: z.number(), longitude: z.number(), speedKmh: z.number().optional() });

export type CreateAmbulanceInput = z.infer<typeof createAmbulanceSchema>;
export type UpdateAmbulanceInput = z.infer<typeof updateAmbulanceSchema>;
