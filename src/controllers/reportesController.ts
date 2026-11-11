import type { Request, Response } from "express";
import prisma from "../db/prisma.js";

export const citasPorEspecialidad = async (_req: Request, res: Response) => {
    try {
        const resultado = await prisma.$queryRaw<
            { especialidad: string; totalCitas: number }[]
        >`
            SELECT e."nombre" AS "especialidad",
                   COUNT(c."id")::int AS "totalCitas"
            FROM "Especialidades" e
            LEFT JOIN "medicos" m ON m."EspecialidadId" = e."id"
            LEFT JOIN "citas" c ON c."medicoId" = m."id"
            GROUP BY e."id", e."nombre"
            ORDER BY e."nombre" ASC
        `;
        return res.status(200).json(resultado);
    } catch (error) {
        console.error("Error al generar reporte por especialidad:", error);
        return res.status(500).json({ mensaje: "No fue posible generar el reporte" });
    }
};

export const corteDiarioCitas = async (req: Request, res: Response) => {
    const fecha = req.query.fecha;
    if (typeof fecha !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return res.status(400).json({
            mensaje: "Proporciona la fecha con formato YYYY-MM-DD"
        });
    }

    const inicio = new Date(`${fecha}T00:00:00.000Z`);
    if (Number.isNaN(inicio.getTime()) || inicio.toISOString().slice(0, 10) !== fecha) {
        return res.status(400).json({ mensaje: "La fecha no es válida" });
    }
    const fin = new Date(inicio);
    fin.setUTCDate(fin.getUTCDate() + 1);

    try {
        const grupos = await prisma.cita.groupBy({
            by: ["estado"],
            where: { fechaHora: { gte: inicio, lt: fin } },
            _count: { _all: true }
        });
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
