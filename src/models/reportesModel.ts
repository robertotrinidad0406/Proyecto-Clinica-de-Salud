import prisma from "../db/prisma.js";

export const contarCitasPorEspecialidadModel = () =>
    prisma.$queryRaw<{ especialidad: string; totalCitas: number }[]>`
        SELECT e."nombre" AS "especialidad",
               COUNT(c."id")::int AS "totalCitas"
        FROM "Especialidades" e
        LEFT JOIN "medicos" m ON m."EspecialidadId" = e."id"
        LEFT JOIN "citas" c ON c."medicoId" = m."id"
        GROUP BY e."id", e."nombre"
        ORDER BY e."nombre" ASC
    `;

export const contarCitasDiariasModel = (inicio: Date, fin: Date) =>
    prisma.cita.groupBy({
        by: ["estado"],
        where: { fechaHora: { gte: inicio, lt: fin } },
        _count: { _all: true }
    });
