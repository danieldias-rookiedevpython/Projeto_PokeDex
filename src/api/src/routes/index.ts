import { Router } from "express";
import abilityRoutes from "./abilityRoutes.js";
import authRoutes from "./authRoutes.js";
import pokemonRoutes from "./pokemonRoutes.js";
import trainerRoutes from "./trainerRoutes.js";
import typeRoutes from "./typeRoutes.js";

const router = Router();

router.use("/pokemons", pokemonRoutes);
router.use("/trainers", trainerRoutes);
router.use("/types", typeRoutes);
router.use("/abilities", abilityRoutes);
router.use("/auth", authRoutes);

export default router;
