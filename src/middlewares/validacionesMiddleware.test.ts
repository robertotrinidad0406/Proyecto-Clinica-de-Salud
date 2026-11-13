import assert from "node:assert/strict";
import test from "node:test";
import { crearMedicoSchema } from "./medicoMiddleware.js";
import { fechaCorteSchema } from "./reportesMiddleware.js";

const datosMedico = {
    NumeroLicencia: "MED-123",
    usuario: {
        nombre: "Carlos",
        apellido: "Ramírez",
        contrasena: "PasswordSegura123",
        telefono: "5551234567"
    },
    especialidad: { nombre: "Cardiología" }
};

test("acepta una fecha de calendario YYYY-MM-DD", () => {
    assert.equal(fechaCorteSchema.safeParse("2026-11-13").success, true);
});

test("rechaza fechas inexistentes y parámetros repetidos", () => {
    assert.equal(fechaCorteSchema.safeParse("2026-02-30").success, false);
    assert.equal(fechaCorteSchema.safeParse(["2026-11-13", "2026-11-14"]).success, false);
});

test("requiere un correo válido al registrar un médico", () => {
    assert.equal(crearMedicoSchema.safeParse(datosMedico).success, false);
    assert.equal(
        crearMedicoSchema.safeParse({
            ...datosMedico,
            usuario: { ...datosMedico.usuario, email: "carlos@clinica.com" }
        }).success,
        true
    );
});
