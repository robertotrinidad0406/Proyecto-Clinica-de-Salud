import type { Request, Response } from "express";
import {
    contarCitasDiariasModel,
    contarCitasPorEspecialidadModel
} from "../models/reportesModel.js";

export const citasPorEspecialidad = async (_req: Request, res: Response) => {
    try {
        const resultado = await contarCitasPorEspecialidadModel();
        return res.status(200).json(resultado);
    } catch (error) {
        console.error("Error al generar reporte por especialidad:", error);
        return res.status(500).json({ mensaje: "No fue posible generar el reporte" });
    }
};

export const corteDiarioCitas = async (_req: Request, res: Response) => {
    const fecha = res.locals.fechaCorte as string;
    const inicio = new Date(`${fecha}T00:00:00.000Z`);
    const fin = new Date(inicio);
    fin.setUTCDate(fin.getUTCDate() + 1);

    try {
        const grupos = await contarCitasDiariasModel(inicio, fin);
        const conteos = new Map(grupos.map(({ estado, _count }) => [estado, _count._all]));
        return res.status(200).json({
            fecha,
            completadas: conteos.get("completada") ?? 0,
            canceladas: conteos.get("cancelada") ?? 0
        });
    } catch (error) {
        console.error("Error al generar el corte diario:", error);
        return res.status(500).json({ mensaje: "No fue posible generar el corte diario" });
    }
};
