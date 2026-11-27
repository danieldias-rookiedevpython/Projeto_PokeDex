import { Router } from "express";
import { loginSchema, registerSchema } from "shared";
import { authController } from "../controllers/authController.js";
import { validarBody } from "../middlewares/validarSchema.js";

const router = Router();

router.post("/register", validarBody(registerSchema), authController.cadastrar);
router.post("/login", validarBody(loginSchema), authController.login);

export default router;
