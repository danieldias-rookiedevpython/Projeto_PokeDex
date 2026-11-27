import { Router } from "express";
import { typeSchema } from "shared";
import { typeController } from "../controllers/typeController.js";
import { autenticar } from "../middlewares/auth.js";
import { validarBody } from "../middlewares/validarSchema.js";

const router = Router();

router.use(autenticar);
router.get("/", typeController.listar);
router.get("/:id", typeController.buscar);
router.post("/", validarBody(typeSchema), typeController.criar);
router.put("/:id", validarBody(typeSchema), typeController.atualizar);
router.delete("/:id", typeController.remover);

export default router;
