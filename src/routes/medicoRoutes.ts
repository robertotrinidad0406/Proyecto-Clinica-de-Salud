import { Router, type Router as RouterType } from "express";
import {
    crearMedico,
    listarMedicos,
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

router.get("/", listarMedicos);
router.get("/:id", validarIdMedico, obtenerMedico);
router.post("/", validarCrearMedico, crearMedico);
router.put("/:id", validarIdMedico, validarActualizarMedico, actualizarMedico);
router.delete("/:id", validarIdMedico, eliminarMedico);

export default router;
