import { Router, type Router as RouterType } from "express";
import {
    citasPorEspecialidad,
    corteDiarioCitas
} from "../controllers/reportesController.js";
import { autorizarRoles, autenticar } from "../middlewares/authMiddleware.js";
import { validarFechaCorteDiario } from "../middlewares/reportesMiddleware.js";

const router: RouterType = Router();
const soloGerencia = [autenticar, autorizarRoles("gerencia")] as const;

router.get("/citas-por-especialidad", ...soloGerencia, citasPorEspecialidad);
router.get(
    "/citas-diarias",
    ...soloGerencia,
    validarFechaCorteDiario,
    corteDiarioCitas
);

export default router;
