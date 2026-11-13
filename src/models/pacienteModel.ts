import type { Prisma } from "../../generated/prisma/client.js";
import prisma from "../db/prisma.js";

export const crearPacienteModel = (data: Prisma.PacientesCreateInput) =>
    prisma.pacientes.create({ data });

export const listarPacientesModel = () =>
    prisma.pacientes.findMany();

export const obtenerPacienteModel = (id: number) =>
    prisma.pacientes.findUnique({
        where: { id },
        include: {
            citas: {
                orderBy: [{ fechaHora: "desc" }, { estado: "asc" }],
                include: {
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
            }
        }
    });

export const actualizarPacienteModel = (
    id: number,
    data: Prisma.PacientesUpdateInput
) => prisma.pacientes.update({ where: { id }, data });

export const eliminarPacienteModel = (id: number) =>
    prisma.pacientes.delete({ where: { id } });