import type { RequestHandler } from "express";
import { z } from "zod";

const pacienteSchema = z.object({
    nombre: z.string().min(1, { message: "El nombre es obligatorio" }),
    apellido: z.string().min(1, { message: "El apellido es obligatorio" }),
    fecha_de_nacimiento: z.coerce.date().refine(
        (fecha) => fecha <= new Date(),
        { message: "La fecha de nacimiento no puede estar en el futuro" }
    ),
    email: z.email({ message: "El email debe ser válido" })
});

const actualizarPacienteSchema = pacienteSchema.partial().refine(
    (data) => Object.keys(data).length > 0, {
    message: "Al menos un campo debe ser proporcionado para la actualización"
}
);

export const validarCrearPaciente: RequestHandler = (req, res, next) => {
    const result = pacienteSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            message: "Error de validación",
            errors: result.error.issues
        });
    }
    req.body = result.data;
    next();
};

export const validarActualizarPaciente: RequestHandler = (req, res, next) => {
    const result = actualizarPacienteSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            message: "Error de validación",
            errors: result.error.issues
        });
    }
    req.body = result.data;
    next();
};

export const validarIdPaciente: RequestHandler = (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "El ID del paciente debe ser un número entero positivo"
        });
    }
    next();
};
