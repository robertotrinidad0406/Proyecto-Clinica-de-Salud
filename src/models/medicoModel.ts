import prisma from "../db/prisma";

type DatosMedico = {
    NumeroLicencia: string;
    userId: number;
    EspecialidadId: number;
}

type DatosActualizarMedico = Partial<DatosMedico>

export const crearMedicoModel = async (data: DatosMedico) => {
    return await prisma.medico.create({
        data
    });
}

export const listarMedicosModel = async () => {
    return await prisma.medico.findMany({
        include: {
            user: true,
            especialidad: true
        }
    })
}

export const obtenerMedicoModel = async (id: number) => {
    return await prisma.medico.findUnique({
        where: { id },
        include: {
            user: true,
            especialidad: true
        }
    })
}

export const actualizarMedicoModel = async (
    id: number,
    data: DatosActualizarMedico
) => {
    return await prisma.medico.update({
        where: { id },
        data
    })
}

export const eliminarMedicoModel = async (id: number) => {
    return await prisma.medico.delete({
        where: { id }
    })
}