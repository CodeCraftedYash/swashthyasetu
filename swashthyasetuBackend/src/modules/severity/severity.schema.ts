import { z } from "zod";

export const patientIdParamSchema = z.object({ patientId: z.string().min(1) });
export const assessmentIdParamSchema = z.object({ id: z.string().min(1) });

export const symptomAssessmentSchema = z.object({
  symptomId: z.string().min(1),
  answer: z.boolean(),
  notes: z.string().optional(),
});

export const createAssessmentSchema = z.object({
  patientId: z.string().optional(),
  score: z.number().int().min(0).max(100),
  severity: z.enum(["LOW", "MODERATE", "SERIOUS", "CRITICAL"]),
  recommendation: z.string().optional(),
  symptoms: z.array(symptomAssessmentSchema).min(1),
});

export type CreateAssessmentInput = z.infer<typeof createAssessmentSchema>;
