import { Router, type Router as RouterType } from "express";
import { listarUsuariosRecepcion } from "../controllers/recepcionController.js";
import { autorizarRoles, autenticar } from "../middlewares/authMiddleware.js";

const router: RouterType = Router();

router.get("/", autenticar, autorizarRoles("gerencia"), listarUsuariosRecepcion);

export default router;
