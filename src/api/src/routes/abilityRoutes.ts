import { Router } from "express";
import { abilitySchema } from "shared";
import { abilityController } from "../controllers/abilityController.js";
import { validarBody } from "../middlewares/validarSchema.js";

const router = Router();

router.get("/", abilityController.listar);
router.get("/:id", abilityController.buscar);
router.post("/", validarBody(abilitySchema), abilityController.criar);
router.put("/:id", validarBody(abilitySchema), abilityController.atualizar);
router.delete("/:id", abilityController.remover);

export default router;
