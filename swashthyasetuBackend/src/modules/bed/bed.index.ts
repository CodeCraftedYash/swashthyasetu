import db from "../../library/Prisma.js";
import { BedRepository } from "../../repositories/bed.repository.js";
import { BedController } from "./bed.controller.js";
import { BedService } from "./bed.service.js";

const bedRepository = new BedRepository(db);
const bedService = new BedService(bedRepository);

export const bedController = new BedController(bedService);
