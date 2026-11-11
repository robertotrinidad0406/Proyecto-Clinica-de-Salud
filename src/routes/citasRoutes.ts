import { Router, type Router as RouterType } from "express";
import {
    actualizarEstadoCita,
    agendarCita,
    obtenerMiAgenda
} from "../controllers/citasController.js";
import {
    validarAgendarCita,
    validarCambioEstadoCita,
    validarIdCita,
    validarRangoAgenda
} from "../middlewares/citasMiddleware.js";
import { autorizarRoles, autenticar } from "../middlewares/authMiddleware.js";

const router: RouterType = Router();

router.post("/", autenticar, autorizarRoles("recepcionista"), validarAgendarCita, agendarCita);
router.get(
    "/mi-agenda",
    autenticar,
    autorizarRoles("medico"),
    validarRangoAgenda,
    obtenerMiAgenda
);
router.patch(
    "/:id/estado",
    autenticar,
    autorizarRoles("medico"),
    validarIdCita,
    validarCambioEstadoCita,
    actualizarEstadoCita
);

export default router;
