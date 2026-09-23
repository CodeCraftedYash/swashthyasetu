import { z } from "zod";

export const notificationIdParamSchema = z.object({ id: z.string().min(1) });
export const notificationReadSchema = z.object({ readAt: z.string().datetime().optional() });

export type NotificationReadInput = z.infer<typeof notificationReadSchema>;
