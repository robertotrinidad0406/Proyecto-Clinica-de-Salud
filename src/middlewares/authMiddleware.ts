import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import type { Rol } from "../../generated/prisma/enums.js";

declare global {
    namespace Express {
        interface Request {
            usuario?: {
                userId: number;
                rol: Rol;
            };
        }
    }
}

const obtenerSecretoJwt = (): string | undefined => process.env.JWT_SECRET;
const claimsSchema = z.object({
    userId: z.number().int().positive(),
    rol: z.enum(["recepcionista", "medico", "gerencia"])
});

export const autenticar: RequestHandler = (req, res, next) => {
    const secreto = obtenerSecretoJwt();
    if (!secreto || secreto.length < 32) {
        console.error("JWT_SECRET debe estar configurada con al menos 32 caracteres");
        return res.status(500).json({ mensaje: "La autenticación no está configurada" });
    }

    const autorizacion = req.headers.authorization;
    const token = autorizacion?.startsWith("Bearer ")
        ? autorizacion.slice("Bearer ".length)
        : undefined;

    if (!token) {
        return res.status(401).json({ mensaje: "Se requiere un token Bearer" });
    }

    try {
        const contenido = jwt.verify(token, secreto);
        const claims = claimsSchema.safeParse(contenido);
        if (!claims.success) {
            return res.status(401).json({ mensaje: "El token no es válido" });
        }

        req.usuario = claims.data;
        next();
    } catch {
        return res.status(401).json({ mensaje: "El token expiró o no es válido" });
    }
};

export const autorizarRoles = (...roles: Rol[]): RequestHandler => (req, res, next) => {
    if (!req.usuario || !roles.includes(req.usuario.rol)) {
        return res.status(403).json({ mensaje: "No tienes permisos para esta operación" });
    }
    next();
};

export const secretoJwt = obtenerSecretoJwt;
