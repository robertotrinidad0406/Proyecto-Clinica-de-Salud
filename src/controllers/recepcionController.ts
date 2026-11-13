import type { Request, Response } from "express";
import prisma from "../db/prisma.js";

export const listarUsuariosRecepcion = async (_req: Request, res: Response) => {
    try {
        const usuarios = await prisma.users.findMany({
            where: { rol: "recepcionista" },
            orderBy: [{ apellido: "asc" }, { nombre: "asc" }],
            select: {
                id: true,
                nombre: true,
                apellido: true,
                email: true,
                telefono: true,
                rol: true
            }
        });

        return res.status(200).json(usuarios);
    } catch (error) {
        console.error("Error al listar usuarios de recepción:", error);
        return res.status(500).json({
            mensaje: "No fue posible obtener los usuarios de recepción"
        });
    }
};
