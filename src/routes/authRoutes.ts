import { Router, type Router as RouterType } from "express";
import {
    crearUsuarioRecepcion,
    iniciarSesion
} from "../controllers/authController.js";
import { autorizarRoles, autenticar } from "../middlewares/authMiddleware.js";

const router: RouterType = Router();

router.post("/login", iniciarSesion);
router.post(
    "/usuarios/recepcion",
    autenticar,
    autorizarRoles("gerencia"),
    crearUsuarioRecepcion
);

export default router;
