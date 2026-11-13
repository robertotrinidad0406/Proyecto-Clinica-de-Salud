import type { RequestHandler } from "express";
import { z } from 'zod';

export const crearMedicoSchema = z.object({
    NumeroLicencia: z.string().trim().min(1, { message: "El número de licencia es obligatorio" }),
    usuario: z.object({
        nombre: z.string().trim().min(1, { message: "El nombre es obligatorio" }),
        apellido: z.string().trim().min(1, { message: "El apellido es obligatorio" }),
        email: z.email({ message: "El correo electrónico es obligatorio y debe ser válido" }),
        contrasena: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
        telefono: z.string().trim().min(1, { message: "El teléfono es obligatorio" })
    }),
    especialidad: z.object({
        nombre: z.string().trim().min(1, { message: "El nombre de la especialidad es obligatorio" }),
        descripcion: z.string().nullable().optional()
    })
});

const actualizarMedicoSchema = z.object({
    NumeroLicencia: z.string().trim().min(1).optional(),
    userId: z.coerce.number().int().positive(),
    EspecialidadId: z.coerce.number().int().positive()
}).partial();

const actualizarMedicoConCamposSchema = actualizarMedicoSchema.refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    { message: "Debes proporcionar al menos un campo para actualizar" }
);

export const validarCrearMedico: RequestHandler = (req, res, next) => {
    const result = crearMedicoSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            mensaje: "Los datos del médico no son válidos",
            errores: result.error.issues
        });
    }

    req.body = result.data;
    next();
};

export const validarActualizarMedico: RequestHandler = (req, res, next) => {
    const result = actualizarMedicoConCamposSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            message: "Error de validación",
            errors: result.error.issues
        });
    }
    req.body = result.data;
    next();
};

export const validarIdMedico: RequestHandler = (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({
            mensaje: "El ID del médico debe ser un entero positivo"
        });
    }
    next();
};