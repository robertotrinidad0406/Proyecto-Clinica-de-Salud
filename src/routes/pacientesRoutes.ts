import { Router } from 'express';

import {
    crearPaciente,
    listarPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
} from "../controllers/pacientesController";

const router: Router = Router();

router.post("/pacientes", crearPaciente);
router.get("/pacientes", listarPacientes);
router.get("/pacientes/:id", obtenerPaciente);
router.put("/pacientes/:id", actualizarPaciente);
router.delete("/pacientes/:id", eliminarPaciente);

export default router;