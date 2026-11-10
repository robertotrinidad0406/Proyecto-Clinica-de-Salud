import type { RequestHandler } from "express";
import { z } from 'zod';

const medicoSchema = z.object({
    NumeroLicencia: z.string().min(1, { message: "El número de licencia es obligatorio" }),
    userId: z.coerce.number().int().positive(),
    EspecialidadId: z.coerce.number().int().positive()
})

const actualizarMedicoSchema = medicoSchema.partial().refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    { message: "Debes proporcionar al menos un campo para actualizar" }
);

export const validarCrearMedico: RequestHandler = (req, res, next) => {
    const result = medicoSchema.safeParse(req.body);
    if (result.success === false)
        return res.status(400).json({
            Message: "Los Datos del Medico no es valido",
            error: result.error.issues
        })
    req.body = result.data
    next()
}

export const validarActualizarMedico: RequestHandler = (req, res, next) => {
    const result = actualizarMedicoSchema.safeParse(req.body);
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