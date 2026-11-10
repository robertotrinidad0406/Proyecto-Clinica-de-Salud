import { Router, type Router as RouterType } from "express";
const router: RouterType = Router();
import {
    crearPaciente,
    listarPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
} from "../controllers/pacientesController";

router.post("/pacientes", crearPaciente);
router.get("/pacientes", listarPacientes);
router.get("/pacientes/:id", obtenerPaciente);
router.put("/pacientes/:id", actualizarPaciente);
router.delete("/pacientes/:id", eliminarPaciente);

export default router;