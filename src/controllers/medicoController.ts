import type { Request, Response } from "express";

import {
    crearMedicoModel,
    listarMedicosModel,
    obtenerMedicoModel,
    actualizarMedicoModel,
    eliminarMedicoModel
} from "../models/medicoModel.js";

export const crearMedico = async (req: Request, res: Response) => {
    try {
        const nuevoMedico = await crearMedicoModel(req.body);

        return res.status(201).json({
            message: "El nuevo Medico ha sido creado correctamente",
            Medico: nuevoMedico
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error al crear el medico",
            error
        });
    }
};

export const listarMedico = async (req: Request, res: Response) => {
    try {
        const medicos = await listarMedicosModel()
        return res.status(200).json(medicos)
    } catch (error) {
        console.error("error al listar Medicos", error)
        return res.status(500).json({
            message: "error al obtener los Medicos"
        })
    }
}

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
        const medicoActualizado = await actualizarMedicoModel(id, req.body)
        return res.status(200).json({
            mensaje: "Médico actualizado correctamente",
            medico: medicoActualizado
        });
    } catch (error) {
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
        console.error("Error al eliminar médico:", error);
        return res.status(500).json({
            mensaje: "Error al eliminar el médico"
        });
    }
};