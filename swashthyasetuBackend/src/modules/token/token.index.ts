import db from "../../library/Prisma.js";
import { TokenRepository } from "../../repositories/token.repository.js";
import { TokenController } from "./token.controller.js";
import { TokenService } from "./token.service.js";

const tokenRepository = new TokenRepository(db);
const tokenService = new TokenService(tokenRepository);

export const tokenController = new TokenController(tokenService);
