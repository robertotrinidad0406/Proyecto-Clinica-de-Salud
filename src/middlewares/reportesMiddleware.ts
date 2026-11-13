import type { RequestHandler } from "express";
import { z } from "zod";

export const fechaCorteSchema = z.iso.date();

export const validarFechaCorteDiario: RequestHandler = (req, res, next) => {
    const resultado = fechaCorteSchema.safeParse(req.query.fecha);
    if (!resultado.success) {
        return res.status(400).json({
            mensaje: "Proporciona una fecha real con formato YYYY-MM-DD",
            errores: resultado.error.issues
        });
    }

    res.locals.fechaCorte = resultado.data;
    next();
};
