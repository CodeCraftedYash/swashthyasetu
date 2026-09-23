import "dotenv/config";
import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import prisma from "./lib/Prisma.js";

async function startServer() {
  try {
    await prisma.$connect();
    logger.info("Database connected");

    app.listen(env.PORT, () => {
      logger.info(`Server started in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });
  } catch (error) {
    logger.fatal(error as Error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();
