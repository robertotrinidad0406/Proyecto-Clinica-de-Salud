const bearer = [{ bearerAuth: [] }];

export const openApiSpec = {
    openapi: "3.0.3",
    info: {
        title: "API Clínica Salud Integral",
        version: "1.0.0",
        description: "API para recepción, atención médica y reportes de gerencia."
    },
    servers: [{ url: "/" }],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT"
            }
        },
        schemas: {
            Error: {
                type: "object",
                properties: { mensaje: { type: "string" } }
            }
        }
    },
    paths: {
        "/api/auth/login": {
            post: {
                summary: "Iniciar sesión y obtener JWT",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["email", "contrasena"],
                                properties: {
                                    email: { type: "string", format: "email" },
                                    contrasena: { type: "string", format: "password" }
                                }
                            }
                        }
                    }
                },
                "/api/auth/usuarios/recepcion": {
                    post: {
                        summary: "Crear usuario de recepción (gerencia)",
                        security: bearer,
                        responses: { "201": { description: "Usuario creado" } }
                    }
                },
                responses: {
                    "200": { description: "Sesión iniciada" },
                    "401": { description: "Credenciales incorrectas" }
                }
            }
        },
        "/api/pacientes": {
            get: {
                summary: "Listar pacientes",
                security: bearer,
                responses: { "200": { description: "Lista de pacientes" } }
            },
            post: {
                summary: "Registrar paciente (recepción)",
                security: bearer,
                responses: { "201": { description: "Paciente creado" } }
            }
        },
        "/api/pacientes/{id}": {
            get: {
                summary: "Consultar expediente e historial de citas",
                security: bearer,
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                responses: { "200": { description: "Expediente del paciente" } }
            }
        },
        "/api/medicos": {
            get: {
                summary: "Listar médicos; filtrar y ordenar por criterios seguros",
                security: bearer,
                parameters: [
                    {
                        name: "especialidad",
                        in: "query",
                        schema: { type: "string" }
                    },
                    {
                        name: "ordenar",
                        in: "query",
                        description: "nombre_asc (predeterminado), nombre_desc, especialidad_asc, especialidad_desc o licencia_asc",
                        schema: {
                            type: "string",
                            enum: ["nombre_asc", "nombre_desc", "especialidad_asc", "especialidad_desc", "licencia_asc"]
                        }
                    }
                ],
                responses: { "200": { description: "Directorio médico" } }
            }
        },
        "/api/citas": {
            post: {
                summary: "Agendar cita (recepción)",
                security: bearer,
                responses: {
                    "201": { description: "Cita agendada" },
                    "409": { description: "El médico ya tiene una cita en ese horario" }
                }
            }
        },
        "/api/citas/mi-agenda": {
            get: {
                summary: "Consultar agenda del médico",
                security: bearer,
                parameters: [
                    { name: "desde", in: "query", required: true, schema: { type: "string", format: "date" } },
                    { name: "hasta", in: "query", required: true, schema: { type: "string", format: "date" } }
                ],
                responses: { "200": { description: "Citas en el rango solicitado" } }
            }
        },
        "/api/citas/{id}/estado": {
            patch: {
                summary: "Marcar cita completada o cancelada (médico propietario)",
                security: bearer,
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                responses: { "200": { description: "Estado actualizado" } }
            }
        },
        "/api/reportes/citas-por-especialidad": {
            get: {
                summary: "Total de citas por especialidad (gerencia)",
                security: bearer,
                responses: { "200": { description: "Volumen agrupado por especialidad" } }
            }
        },
        "/api/reportes/citas-diarias": {
            get: {
                summary: "Corte diario de citas (gerencia)",
                security: bearer,
                parameters: [{ name: "fecha", in: "query", required: true, schema: { type: "string", format: "date" } }],
                responses: { "200": { description: "Conteo de citas completadas y canceladas" } }
            }
        }
    }
};
