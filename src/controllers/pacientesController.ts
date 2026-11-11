import type { Request, Response } from 'express';
import prisma from "../db/prisma.js"

export const crearPaciente = async (req: Request, res: Response) => {
    try {
        const {
            nombre,
            apellido,
            fecha_de_nacimiento,
            email
        } = req.body;
        const nuevoPaciente = await prisma.pacientes.create({
            data: {
                nombre,
                apellido,
                fecha_de_nacimiento: new Date(fecha_de_nacimiento),
                email
            }
        });
        return res.status(201).json({
            message: 'Paciente creado exitosamente',
            paciente: nuevoPaciente
        });
    } catch (error) {
        console.error('Error al crear el paciente:', error);
        return res.status(500).json({
            message: 'Error al crear el paciente', error
        });
    }
};

export const listarPacientes = async (req: Request, res: Response) => {
    try {
        const pacientes = await prisma.pacientes.findMany();
        return res.status(200).json(pacientes);
    } catch (error) {
        console.error('Error al listar los pacientes:', error);
        return res.status(500).json({
            message: 'Error al listar los pacientes', error
        });
    }
};

export const obtenerPaciente = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const paciente = await prisma.pacientes.findUnique({
            where: { id: Number(id) },
            include: {
                citas: {
                    orderBy: [
                        { fechaHora: "desc" },
                        { estado: "asc" }
                    ],
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
        if (!paciente) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }
        return res.status(200).json(paciente);
    } catch (error) {
        console.error('Error al obtener el paciente:', error);
        return res.status(500).json({
            message: 'Error al obtener el paciente', error
        });
    }
};

export const actualizarPaciente = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            nombre,
            apellido,
            fecha_de_nacimiento,
            email
        } = req.body;
        const data = {
            ...(nombre !== undefined && { nombre }),
            ...(apellido !== undefined && { apellido }),
            ...(fecha_de_nacimiento !== undefined && {
                fecha_de_nacimiento: new Date(fecha_de_nacimiento)
            }),
            ...(email !== undefined && { email })
        };
        const pacienteActualizado = await prisma.pacientes.update({
            where: { id: Number(id) },
            data
        });
        return res.status(200).json({
            message: 'Paciente actualizado exitosamente',
            paciente: pacienteActualizado
        });
    } catch (error) {
        console.error('Error al actualizar el paciente:', error);
        return res.status(500).json({
            message: 'Error al actualizar el paciente', error
        });
    }
};

export const eliminarPaciente = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.pacientes.delete({
            where: { id: Number(id) }
        });
        return res.status(200).json({ message: 'Paciente eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el paciente:', error);
        return res.status(500).json({
            message: 'Error al eliminar el paciente', error
        });
    }

}

export default {
    crearPaciente,
    listarPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
};
