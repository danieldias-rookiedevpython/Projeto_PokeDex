import { Router } from "express";
import { trainerWithUserSchema } from "shared";
import { trainerController } from "../controllers/trainerController.js";
import { validarBody } from "../middlewares/validarSchema.js";

const router = Router();

router.get("/", trainerController.listar);
router.get("/:id", trainerController.buscar);
router.post("/", validarBody(trainerWithUserSchema), trainerController.criar);
router.put("/:id", validarBody(trainerWithUserSchema), trainerController.atualizar);
router.delete("/:id", trainerController.remover);

export default router;
