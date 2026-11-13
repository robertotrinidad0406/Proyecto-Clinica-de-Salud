import prisma from "../db/prisma.js";

type DatosCrearCita = {
    pacienteId: number;
    medicoId: number;
    fechaHora: Date;
    motivo: string;
};

export const crearCitaModel = ({
    pacienteId,
    medicoId,
    fechaHora,
    motivo
}: DatosCrearCita) => prisma.cita.create({
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

export const obtenerMedicoPorUsuarioModel = (userId: number) =>
    prisma.medico.findUnique({
        where: { userId },
        select: { id: true }
    });

export const listarAgendaMedicoModel = (
    medicoId: number,
    rango?: { desde: Date; hasta: Date }
) => prisma.cita.findMany({
    where: {
        medicoId,
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
                    select: { id: true, nombre: true, apellido: true }
                },
                especialidad: true
            }
        }
    }
});

export const actualizarCitaProgramadaModel = (
    citaId: number,
    medicoId: number,
    estado: "completada" | "cancelada"
) => prisma.cita.updateMany({
    where: { id: citaId, medicoId, estado: "programada" },
    data: { estado }
});

export const obtenerCitaEstadoModel = (id: number) =>
    prisma.cita.findUnique({
        where: { id },
        select: { id: true, medicoId: true, estado: true }
    });

export const obtenerCitaConPacienteModel = (id: number) =>
    prisma.cita.findUnique({
        where: { id },
        include: { Paciente: true }
    });
