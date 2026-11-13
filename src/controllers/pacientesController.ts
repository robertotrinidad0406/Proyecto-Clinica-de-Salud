import type { Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client.js";
import {
    actualizarPacienteModel,
    crearPacienteModel,
    eliminarPacienteModel,
    listarPacientesModel,
    obtenerPacienteModel
} from "../models/pacienteModel.js";

const responderErrorPaciente = (
    res: Response,
    error: unknown,
    operacion: string
) => {
    const mensajesError: Record<string, string> = {
        crear: "Error al crear el paciente",
        listar: "Error al listar los pacientes",
        obtener: "Error al obtener el paciente",
        actualizar: "Error al actualizar el paciente",
        eliminar: "Error al eliminar el paciente"
    };

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
            return res.status(404).json({ message: "Paciente no encontrado" });
        }
        if (error.code === "P2002") {
            return res.status(409).json({ message: "Ya existe un paciente con esos datos" });
        }
        if (error.code === "P2003") {
            const message = operacion === "eliminar"
                ? "No se puede eliminar el paciente porque tiene citas asociadas"
                : "Una referencia indicada no existe";
            return res.status(409).json({ message });
        }
    }

    console.error(`Error al ${operacion} paciente:`, error);
    return res.status(500).json({
        message: mensajesError[operacion] ?? "Error al procesar el paciente"
    });
};

export const crearPaciente = async (req: Request, res: Response) => {
    try {
        const { nombre, apellido, fecha_de_nacimiento, email } = req.body;
        const paciente = await crearPacienteModel({
            nombre,
            apellido,
            fecha_de_nacimiento,
            email
        });
        return res.status(201).json({
            message: "Paciente creado exitosamente",
            paciente
        });
    } catch (error) {
        return responderErrorPaciente(res, error, "crear");
    }
};

export const listarPacientes = async (_req: Request, res: Response) => {
    try {
        return res.status(200).json(await listarPacientesModel());
    } catch (error) {
        return responderErrorPaciente(res, error, "listar");
    }
};

export const obtenerPaciente = async (req: Request, res: Response) => {
    try {
        const paciente = await obtenerPacienteModel(Number(req.params.id));
        if (!paciente) {
            return res.status(404).json({ message: "Paciente no encontrado" });
        }
        return res.status(200).json(paciente);
    } catch (error) {
        return responderErrorPaciente(res, error, "obtener");
    }
};

export const actualizarPaciente = async (req: Request, res: Response) => {
    try {
        const paciente = await actualizarPacienteModel(
            Number(req.params.id),
            req.body
        );
        return res.status(200).json({
            message: "Paciente actualizado exitosamente",
            paciente
        });
    } catch (error) {
        return responderErrorPaciente(res, error, "actualizar");
    }
};

export const eliminarPaciente = async (req: Request, res: Response) => {
    try {
        await eliminarPacienteModel(Number(req.params.id));
        return res.status(200).json({ message: "Paciente eliminado exitosamente" });
    } catch (error) {
        return responderErrorPaciente(res, error, "eliminar");
    }
};

export default {
    crearPaciente,
    listarPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
};
