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
import { autorizarRoles, autenticar } from "../middlewares/authMiddleware.js";

const router: RouterType = Router();

router.get("/", autenticar, autorizarRoles("recepcionista", "medico", "gerencia"), listarMedicos);
router.get("/:id", autenticar, autorizarRoles("recepcionista", "medico", "gerencia"), validarIdMedico, obtenerMedico);
router.post("/", autenticar, autorizarRoles("gerencia"), validarCrearMedico, crearMedico);
router.put("/:id", autenticar, autorizarRoles("gerencia"), validarIdMedico, validarActualizarMedico, actualizarMedico);
router.delete("/:id", autenticar, autorizarRoles("gerencia"), validarIdMedico, eliminarMedico);

export default router;
