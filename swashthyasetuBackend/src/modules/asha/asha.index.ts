import db from "../../library/Prisma.js";
import { AshaRepository } from "../../repositories/asha.repository.js";
import { AshaController } from "./asha.controller.js";
import { AshaService } from "./asha.service.js";

const ashaRepository = new AshaRepository(db);
const ashaService = new AshaService(ashaRepository);

export const ashaController = new AshaController(ashaService);
