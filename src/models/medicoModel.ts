import prisma from "../db/prisma.js";
import type { Prisma } from "../../generated/prisma/client.js";

type DatosCrearMedico = {
    NumeroLicencia: string;
    usuario: {
        nombre: string;
        apellido: string;
        email?: string | null;
        contrasena: string;
        telefono: string;
    };
    especialidad: {
        nombre: string;
        descripcion?: string | null;
    };
};

type DatosActualizarMedico = {
    NumeroLicencia?: string;
    userId?: number;
    EspecialidadId?: number;
};

const medicoDetalle = {
    user: {
        select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            telefono: true,
            rol: true,
            createAt: true,
            updatedAt: true
        }
    },
    especialidad: true
} satisfies Prisma.MedicoInclude;

export const crearMedicoModel = async (data: DatosCrearMedico) => {
    return prisma.$transaction(async (tx) => {
        const especialidad = await tx.especialidad.upsert({
            where: { nombre: data.especialidad.nombre },
            update: {},
            create: {
                nombre: data.especialidad.nombre,
                descripcion: data.especialidad.descripcion ?? null
            }
        });

        const user = await tx.users.create({
            data: {
                nombre: data.usuario.nombre,
                apellido: data.usuario.apellido,
                email: data.usuario.email ?? null,
                contrasena: data.usuario.contrasena,
                telefono: data.usuario.telefono,
                rol: "medico"
            }
        });

        return tx.medico.create({
            data: {
                NumeroLicencia: data.NumeroLicencia,
                userId: user.id,
                EspecialidadId: especialidad.id
            },
            include: medicoDetalle
        });
    });
}

export const listarMedicosModel = async () => {
    return prisma.medico.findMany({
        include: medicoDetalle
    });
}

export const obtenerMedicoModel = async (id: number) => {
    return prisma.medico.findUnique({
        where: { id },
        include: medicoDetalle
    });
}

export const actualizarMedicoModel = async (
    id: number,
    data: DatosActualizarMedico
) => {
    return prisma.medico.update({
        where: { id },
        data,
        include: medicoDetalle
    });
}

export const eliminarMedicoModel = async (id: number) => {
    return prisma.medico.delete({
        where: { id }
    });
};