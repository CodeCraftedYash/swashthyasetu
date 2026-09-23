import { z } from "zod";

export const schemeIdParamSchema = z.object({ id: z.string().min(1) });
export const patientIdParamSchema = z.object({ patientId: z.string().min(1) });
export const schemeApplicationIdParamSchema = z.object({ id: z.string().min(1) });

export const createSchemeSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  benefits: z.string().optional(),
  eligibility: z.string().optional(),
  officialUrl: z.string().url().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]).optional(),
});

export const applySchemeSchema = z.object({
  patientId: z.string().min(1),
  notes: z.string().optional(),
});

export const updateSchemeStatusSchema = z.object({ status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]) });
export const updateApplicationStatusSchema = z.object({ status: z.string().min(1) });

export type CreateSchemeInput = z.infer<typeof createSchemeSchema>;
