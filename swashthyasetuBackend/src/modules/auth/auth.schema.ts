import { z } from "zod";

const userRoleEnum = z.enum([
  "PATIENT",
  "DOCTOR",
  "ASHA_WORKER",
  "HOSPITAL_STAFF",
  "POLICE_RESPONDER",
  "AMBULANCE_DRIVER",
  "GOVERNMENT_ADMIN",
  "SUPER_ADMIN",
]);

export const registerSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(10).max(15).optional(),
  password: z.string().min(8).max(128),
  firstName: z.string().min(2).max(60),
  lastName: z.string().min(1).max(60).optional(),
  roles: z.array(userRoleEnum).default(["PATIENT"]),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1).optional(),
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(1).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
