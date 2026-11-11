import { Router, type Router as RouterType } from "express";
import {
    crearPaciente,
    listarPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
} from "../controllers/pacientesController.js";
import {
    validarCrearPaciente,
    validarActualizarPaciente,
    validarIdPaciente
} from "../middlewares/pacientesMiddleware.js";
import { autorizarRoles, autenticar } from "../middlewares/authMiddleware.js";

const router: RouterType = Router();

router.post("/", autenticar, autorizarRoles("recepcionista"), validarCrearPaciente, crearPaciente);
router.get("/", autenticar, autorizarRoles("recepcionista", "medico", "gerencia"), listarPacientes);
router.get("/:id", autenticar, autorizarRoles("recepcionista", "medico", "gerencia"), validarIdPaciente, obtenerPaciente);
router.put("/:id", autenticar, autorizarRoles("recepcionista"), validarIdPaciente, validarActualizarPaciente, actualizarPaciente);
router.delete("/:id", autenticar, autorizarRoles("recepcionista"), validarIdPaciente, eliminarPaciente);

export default router;
