import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Prisma } from "../../generated/prisma/client.js";

import {
    crearMedicoModel,
    listarMedicosModel,
    obtenerMedicoModel,
    actualizarMedicoModel,
    eliminarMedicoModel
} from "../models/medicoModel.js";

const esErrorPrisma = (error: unknown, code: string): boolean =>
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === code;

export const crearMedico = async (req: Request, res: Response) => {
    try {
        const contrasena = await bcrypt.hash(req.body.usuario.contrasena, 10);
        const nuevoMedico = await crearMedicoModel({
            ...req.body,
            usuario: {
                ...req.body.usuario,
                contrasena
            }
        });

        return res.status(201).json({
            mensaje: "Médico creado correctamente",
            medico: nuevoMedico
        });
    } catch (error) {
        if (esErrorPrisma(error, "P2002")) {
            return res.status(409).json({
                mensaje: "Ya existe un médico con ese número de licencia o un usuario con ese correo"
            });
        }

        console.error("Error al crear médico:", error);
        return res.status(500).json({
            mensaje: "Error al crear el médico"
        });
    }
};

export const listarMedicos = async (_req: Request, res: Response) => {
    try {
        const medicos = await listarMedicosModel();
        return res.status(200).json(medicos);
    } catch (error) {
        console.error("Error al listar médicos:", error);
        return res.status(500).json({
            mensaje: "Error al obtener los médicos"
        });
    }
};

export const obtenerMedico = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const medico = await obtenerMedicoModel(id);

        if (!medico) {
            return res.status(404).json({
                mensaje: "Médico no encontrado"
            });
        }

        return res.status(200).json(medico);
    } catch (error) {
        console.error("Error al obtener médico:", error);

        return res.status(500).json({
            mensaje: "Error al obtener el médico"
        });
    }
};

export const actualizarMedico = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const medicoActualizado = await actualizarMedicoModel(id, req.body);
        return res.status(200).json({
            mensaje: "Médico actualizado correctamente",
            medico: medicoActualizado
        });
    } catch (error) {
        if (esErrorPrisma(error, "P2025")) {
            return res.status(404).json({
                mensaje: "Médico no encontrado"
            });
        }

        if (esErrorPrisma(error, "P2002")) {
            return res.status(409).json({
                mensaje: "Ya existe un médico con ese número de licencia o usuario"
            });
        }

        if (esErrorPrisma(error, "P2003")) {
            return res.status(400).json({
                mensaje: "El usuario o la especialidad indicados no existen"
            });
        }

        console.error("Error al actualizar médico:", error);
        return res.status(500).json({
            mensaje: "Error al actualizar el médico"
        });
    }
};


export const eliminarMedico = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        await eliminarMedicoModel(id);
        return res.status(200).json({
            mensaje: "Médico eliminado correctamente"
        });
    } catch (error) {
        if (esErrorPrisma(error, "P2025")) {
            return res.status(404).json({
                mensaje: "Médico no encontrado"
            });
        }

        if (esErrorPrisma(error, "P2003")) {
            return res.status(409).json({
                mensaje: "No se puede eliminar el médico porque tiene citas asociadas"
            });
        }

        console.error("Error al eliminar médico:", error);
        return res.status(500).json({
            mensaje: "Error al eliminar el médico"
        });
    }
};