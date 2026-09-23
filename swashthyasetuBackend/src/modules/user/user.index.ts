import db from "../../library/Prisma.js";
import { UserRepository } from "../../repositories/user.repository.js";
import { UserController } from "./user.controller.js";
import { UserService } from "./user.service.js";

const userRepository = new UserRepository(db);
const userService = new UserService(userRepository);

export const userController = new UserController(userService);
