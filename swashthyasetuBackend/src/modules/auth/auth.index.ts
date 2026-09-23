import db from "../../lib/Prisma.js";
import { SessionRepository } from "../../repositories/session.repository.js";
import { UserRepository } from "../../repositories/user.repository.js";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";

const authService = new AuthService(new UserRepository(db), new SessionRepository(db));

export const authController = new AuthController(authService);
