import prisma from "../db/prisma.js"

type DatosPaciente = {
    nombre: string;
    apellido: string;
    fecha_de_nacimiento: Date;
    email: string;
};

export const crearPaciente = async (data: {
    nombre: string;
    apellido: string;
    fecha_de_nacimiento: Date;
    email: string;
}) => {
    return await prisma.pacientes.create({
        data: {
            nombre: data.nombre,
            apellido: data.apellido,
            fecha_de_nacimiento: data.fecha_de_nacimiento,
            email: data.email
        }
    });
}

export const listarPacientes = async () => {
    return await prisma.pacientes.findMany({
    });
}

export const obtenerPaciente = async (id: number) => {
    return await prisma.pacientes.findUnique({
        where: { id }
    });
}

export const actualizarPaciente = async (id: number, data: DatosPaciente) => {
    return await prisma.pacientes.update({
        where: { id },
        data
    });
}

export const eliminarPaciente = async (id: number) => {
    return await prisma.pacientes.delete({
        where: { id }
    });
}