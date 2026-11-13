import type { RequestHandler } from "express";
import { z } from "zod";

const agendarCitaSchema = z.object({
    pacienteId: z.coerce.number().int().positive(),
    medicoId: z.coerce.number().int().positive(),
    fechaHora: z.coerce.date().refine(
        (fecha) => fecha >= new Date(),
        { message: "No se puede agendar una cita en el pasado" }
    ),
    motivo: z.string().trim().min(1).max(500)
});

const estadoCitaSchema = z.object({
    estado: z.enum(["completada", "cancelada"])
});

const idCitaSchema = z.coerce.number().int().positive();
const fechasAgendaSchema = z.object({
    desde: z.iso.date().optional(),
    hasta: z.iso.date().optional()
}).refine(({ desde, hasta }) => (desde === undefined) === (hasta === undefined), {
    message: "Proporciona ambos parámetros, 'desde' y 'hasta'"
}).refine(({ desde, hasta }) => desde === undefined || hasta === undefined || desde <= hasta, {
    message: "La fecha 'desde' debe ser anterior o igual a 'hasta'"
});

export const validarAgendarCita: RequestHandler = (req, res, next) => {
    const resultado = agendarCitaSchema.safeParse(req.body);
    if (!resultado.success) {
        return res.status(400).json({
            mensaje: "Los datos de la cita no son válidos",
            errores: resultado.error.issues
        });
    }
    req.body = resultado.data;
    next();
};

export const validarCambioEstadoCita: RequestHandler = (req, res, next) => {
    const resultado = estadoCitaSchema.safeParse(req.body);
    if (!resultado.success) {
        return res.status(400).json({
            mensaje: "El estado debe ser 'completada' o 'cancelada'",
            errores: resultado.error.issues
        });
    }
    req.body = resultado.data;
    next();
};

export const validarIdCita: RequestHandler = (req, res, next) => {
    const resultado = idCitaSchema.safeParse(req.params.id);
    if (!resultado.success) {
        return res.status(400).json({ mensaje: "El ID de la cita debe ser un entero positivo" });
    }
    res.locals.citaId = resultado.data;
    next();
};

export const validarRangoAgenda: RequestHandler = (req, res, next) => {
    const resultado = fechasAgendaSchema.safeParse({
        desde: req.query.desde,
        hasta: req.query.hasta
    });
    if (!resultado.success) {
        return res.status(400).json({
            mensaje: "Proporciona ambos parámetros desde y hasta con fechas válidas YYYY-MM-DD",
            errores: resultado.error.issues
        });
    }

    if (resultado.data.desde && resultado.data.hasta) {
        const desde = new Date(`${resultado.data.desde}T00:00:00.000Z`);
        const hasta = new Date(`${resultado.data.hasta}T00:00:00.000Z`);
        hasta.setUTCDate(hasta.getUTCDate() + 1);
        res.locals.rangoAgenda = { desde, hasta };
    }

    next();
};
