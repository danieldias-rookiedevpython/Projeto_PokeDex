import { Router } from "express";
import { pokemonSchema } from "shared";
import { pokemonController } from "../controllers/pokemonController.js";
import { autenticar } from "../middlewares/auth.js";
import { validarBody } from "../middlewares/validarSchema.js";

const router = Router();

router.use(autenticar);
router.get("/", pokemonController.listar);
router.get("/:id", pokemonController.buscar);
router.post("/", validarBody(pokemonSchema), pokemonController.criar);
router.put("/:id", validarBody(pokemonSchema), pokemonController.atualizar);
router.delete("/:id", pokemonController.remover);

export default router;
