import dotenv from "dotenv";
import { z } from 'zod';

dotenv.config({ override: true });

const envSchema = z.object({
    PORT: z.coerce.number().default(5000),
    NODE_ENV: z.enum(["development","production","test"]),
    CLIENT_URL: z.string(),
    LOG_LEVEL: z.enum([
        "fatal",
        "error",
        "warn",
        "info",
        "debug",
        "trace"
]),
DATABASE_URL:z.string().min(1, "DATABASE_URL cannot be empty"),
ACCESS_TOKEN_SECRET:z.string().trim(),

ACCESS_TOKEN_EXPIRES_IN:z.enum([
  "15m",
  "30m",
  "1h",
  "7d",
]),
REFRESH_TOKEN_SECRET: z.string().trim(),
REFRESH_TOKEN_EXPIRES_IN: z.enum([
  "7d",
  "30d",
]),
})

export const env = envSchema.parse(process.env);
