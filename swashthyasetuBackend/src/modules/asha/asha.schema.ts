import { z } from "zod";

export const taskIdParamSchema = z.object({ id: z.string().min(1) });
export const householdIdParamSchema = z.object({ id: z.string().min(1) });

export const taskSchema = z.object({
  patientId: z.string().min(1),
  ashaWorkerId: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "MISSED", "CANCELLED"]).optional(),
});

export const updateTaskStatusSchema = z.object({ status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "MISSED", "CANCELLED"]) });
export const householdSchema = z.object({
  ashaWorkerId: z.string().optional(),
  name: z.string().min(1),
  address: z.string().optional(),
  village: z.string().optional(),
  district: z.string().optional(),
  priority: z.number().int().optional(),
});

export type TaskInput = z.infer<typeof taskSchema>;
