import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { Prisma } from "../../generated/prisma/client.js";
import prisma from "../db/prisma.js";

const loginSchema = z.object({
    email: z.email(),
    contrasena: z.string().min(1)
});

const recepcionistaSchema = z.object({
    nombre: z.string().trim().min(1),
    apellido: z.string().trim().min(1),
    email: z.email(),
    telefono: z.string().trim().min(1),
    contrasena: z.string().min(12)
});

export const iniciarSesion = async (req: Request, res: Response) => {
    const datos = loginSchema.safeParse(req.body);
    if (!datos.success) {
        return res.status(400).json({
            mensaje: "Proporciona un correo válido y una contraseña",
            errores: datos.error.issues
        });
    }

    const secreto = process.env.JWT_SECRET;
    if (!secreto || secreto.length < 32) {
        console.error("JWT_SECRET debe estar configurada con al menos 32 caracteres");
        return res.status(500).json({ mensaje: "La autenticación no está configurada" });
    }

    try {
        const usuario = await prisma.users.findUnique({
            where: { email: datos.data.email }
        });
        const contrasenaValida = usuario
            ? await bcrypt.compare(datos.data.contrasena, usuario.contrasena)
            : false;

        if (!usuario || !contrasenaValida) {
            return res.status(401).json({ mensaje: "Correo o contraseña incorrectos" });
        }

        const token = jwt.sign(
            { userId: usuario.id, rol: usuario.rol },
            secreto,
            { expiresIn: "8h" }
        );

        return res.status(200).json({
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                rol: usuario.rol
            }
        });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        return res.status(500).json({ mensaje: "No fue posible iniciar sesión" });
    }
};

export const crearUsuarioRecepcion = async (req: Request, res: Response) => {
    const datos = recepcionistaSchema.safeParse(req.body);
    if (!datos.success) {
        return res.status(400).json({
            mensaje: "Los datos del usuario no son válidos",
            errores: datos.error.issues
        });
    }

    try {
        const contrasena = await bcrypt.hash(datos.data.contrasena, 12);
        const usuario = await prisma.users.create({
            data: {
                ...datos.data,
                contrasena,
                rol: "recepcionista"
            },
            select: {
                id: true,
                nombre: true,
                apellido: true,
                email: true,
                telefono: true,
                rol: true
            }
        });
        return res.status(201).json({ mensaje: "Usuario de recepción creado", usuario });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return res.status(409).json({ mensaje: "Ya existe un usuario con ese correo" });
        }
        console.error("Error al crear usuario de recepción:", error);
        return res.status(500).json({ mensaje: "No fue posible crear el usuario" });
    }
};
