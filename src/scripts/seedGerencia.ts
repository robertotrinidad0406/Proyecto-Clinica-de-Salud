import "dotenv/config";
import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "../db/prisma.js";

const configuracionSchema = z.object({
    SEED_GERENCIA_NOMBRE: z.string().trim().min(1),
    SEED_GERENCIA_APELLIDO: z.string().trim().min(1),
    SEED_GERENCIA_EMAIL: z.email(),
    SEED_GERENCIA_TELEFONO: z.string().trim().min(1),
    SEED_GERENCIA_PASSWORD: z.string().min(12)
});

const configuracion = configuracionSchema.safeParse(process.env);

if (!configuracion.success) {
    console.error("Configura los datos SEED_GERENCIA_* en .env; la contraseña requiere 12 caracteres.");
    process.exitCode = 1;
} else {
    try {
        const { data } = configuracion;
        const existente = await prisma.users.findUnique({
            where: { email: data.SEED_GERENCIA_EMAIL }
        });
        if (existente) {
            throw new Error("Ya existe un usuario con el correo indicado; no se modificó.");
        }

        const contrasena = await bcrypt.hash(data.SEED_GERENCIA_PASSWORD, 12);
        await prisma.users.create({
            data: {
                nombre: data.SEED_GERENCIA_NOMBRE,
                apellido: data.SEED_GERENCIA_APELLIDO,
                email: data.SEED_GERENCIA_EMAIL,
                telefono: data.SEED_GERENCIA_TELEFONO,
                contrasena,
                rol: "gerencia"
            }
        });
        console.log("Usuario inicial de gerencia creado.");
    } catch (error) {
        console.error("No fue posible crear el usuario inicial de gerencia:", error);
        process.exitCode = 1;
    } finally {
        await prisma.$disconnect();
    }
}
