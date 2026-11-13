import type { Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client.js";
import prisma from "../db/prisma.js";

const esErrorPrisma = (error: unknown, code: string): boolean =>
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === code;

export const agendarCita = async (req: Request, res: Response) => {
    const { pacienteId, medicoId, fechaHora, motivo } = req.body as {
        pacienteId: number;
        medicoId: number;
        fechaHora: Date;
        motivo: string;
    };

    try {
        const cita = await prisma.cita.create({
            data: {
                PacientesId: pacienteId,
                medicoId,
                fechaHora,
                Motivo: motivo
            },
            include: {
                Paciente: true,
                medico: {
                    include: {
                        user: { select: { id: true, nombre: true, apellido: true } },
                        especialidad: true
                    }
                }
            }
        });
        return res.status(201).json({ mensaje: "Cita agendada", cita });
    } catch (error) {
        if (esErrorPrisma(error, "P2002")) {
            return res.status(409).json({
                mensaje: "El médico ya tiene una cita en ese horario"
            });
        }
        if (esErrorPrisma(error, "P2003")) {
            return res.status(404).json({
                mensaje: "El paciente o el médico indicado no existe"
            });
        }
        console.error("Error al agendar cita:", error);
        return res.status(500).json({ mensaje: "No fue posible agendar la cita" });
    }
};

export const obtenerMiAgenda = async (req: Request, res: Response) => {
    if (!req.usuario) {
        return res.status(401).json({ mensaje: "Se requiere autenticación" });
    }

    const rango = res.locals.rangoAgenda as { desde: Date; hasta: Date } | undefined;
    try {
        const medico = await prisma.medico.findUnique({
            where: { userId: req.usuario.userId },
            select: { id: true }
        });
        if (!medico) {
            return res.status(403).json({ mensaje: "El usuario no tiene un perfil médico" });
        }

        const citas = await prisma.cita.findMany({
            where: {
                medicoId: medico.id,
                ...(rango && { fechaHora: { gte: rango.desde, lt: rango.hasta } })
            },
            orderBy: [
                { fechaHora: "asc" },
                { Paciente: { apellido: "asc" } },
                { Paciente: { nombre: "asc" } }
            ],
            include: {
                Paciente: true,
                medico: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                nombre: true,
                                apellido: true
                            }
                        },
                        especialidad: true
                    }
                }
            }
        });
        return res.status(200).json(citas);
    } catch (error) {
        console.error("Error al consultar agenda médica:", error);
        return res.status(500).json({ mensaje: "No fue posible obtener la agenda" });
    }
};

export const actualizarEstadoCita = async (req: Request, res: Response) => {
    if (!req.usuario) {
        return res.status(401).json({ mensaje: "Se requiere autenticación" });
    }

    const citaId = res.locals.citaId as number;
    const { estado } = req.body as { estado: "completada" | "cancelada" };

    try {
        const medico = await prisma.medico.findUnique({
            where: { userId: req.usuario.userId },
            select: { id: true }
        });
        if (!medico) {
            return res.status(403).json({ mensaje: "El usuario no tiene un perfil médico" });
        }

        const resultado = await prisma.cita.updateMany({
            where: {
                id: citaId,
                medicoId: medico.id,
                estado: "programada"
            },
            data: { estado }
        });
        if (resultado.count === 0) {
            const cita = await prisma.cita.findUnique({
                where: { id: citaId },
                select: { id: true, medicoId: true, estado: true }
            });
            if (!cita) {
                return res.status(404).json({ mensaje: "Cita no encontrada" });
            }
            if (cita.medicoId !== medico.id) {
                return res.status(403).json({ mensaje: "La cita no pertenece a este médico" });
            }
            return res.status(409).json({
                mensaje: "Solo se puede cambiar el estado de una cita programada"
            });
        }

        const citaActualizada = await prisma.cita.findUnique({
            where: { id: citaId },
            include: { Paciente: true }
        });
        return res.status(200).json({
            mensaje: "Estado de la cita actualizado",
            cita: citaActualizada
        });
    } catch (error) {
        console.error("Error al actualizar estado de cita:", error);
        return res.status(500).json({ mensaje: "No fue posible actualizar la cita" });
    }
};
