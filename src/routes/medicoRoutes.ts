import { Router, type Router as RouterType } from "express";
import {
    crearMedico,
    listarMedico,
    obtenerMedico,
    actualizarMedico,
    eliminarMedico
} from "../controllers/medicoController.js";
import {
    validarCrearMedico,
    validarActualizarMedico,
    validarIdMedico
} from "../middlewares/medicoMiddleware.js";
const router: RouterType = Router();
router.post("/", validarCrearMedico, crearMedico);
router.get("/", listarMedico);
router.get("/:id", validarIdMedico, obtenerMedico);
router.put("/:id", validarIdMedico, validarActualizarMedico, actualizarMedico);
router.delete("/:id", validarIdMedico, eliminarMedico);
export default router;
