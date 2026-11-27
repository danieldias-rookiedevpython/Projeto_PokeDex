import { Router } from "express";
import { trainerWithUserSchema } from "shared";
import { trainerController } from "../controllers/trainerController.js";
import { autenticar, type AuthenticatedRequest } from "../middlewares/auth.js";
import { validarBody } from "../middlewares/validarSchema.js";

const router = Router();

router.use(autenticar);
router.get("/", trainerController.listar);
router.get("/:id", trainerController.buscar);
router.post("/", (req, _res, next) => {
    const authUser = (req as AuthenticatedRequest).authUser;
    req.body = { ...req.body, userId: authUser?.id };
    next();
}, validarBody(trainerWithUserSchema), trainerController.criar);
router.put("/:id", (req, _res, next) => {
    const authUser = (req as AuthenticatedRequest).authUser;
    req.body = { ...req.body, userId: authUser?.id };
    next();
}, validarBody(trainerWithUserSchema), trainerController.atualizar);
router.delete("/:id", trainerController.remover);

export default router;
