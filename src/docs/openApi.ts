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
                properties: {
                    mensaje: { type: "string" }
                }
            },
            LoginRequest: {
                type: "object",
                required: ["email", "contrasena"],
                properties: {
                    email: { type: "string", format: "email", example: "ana@clinica.com" },
                    contrasena: { type: "string", format: "password", example: "PasswordSegura123" }
                }
            },
            LoginResponse: {
                type: "object",
                properties: {
                    token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
                    usuario: {
                        type: "object",
                        properties: {
                            id: { type: "integer", example: 3 },
                            nombre: { type: "string", example: "Ana" },
                            apellido: { type: "string", example: "García" },
                            email: { type: "string", format: "email", example: "ana@clinica.com" },
                            rol: { type: "string", example: "recepcionista" }
                        }
                    }
                }
            },
            UsuarioRecepcionRequest: {
                type: "object",
                required: ["nombre", "apellido", "email", "telefono", "contrasena"],
                properties: {
                    nombre: { type: "string", example: "María" },
                    apellido: { type: "string", example: "López" },
                    email: { type: "string", format: "email", example: "maria@clinica.com" },
                    telefono: { type: "string", example: "5551234567" },
                    contrasena: { type: "string", format: "password", example: "PasswordSegura123" }
                }
            },
            UsuarioRecepcionResponse: {
                type: "object",
                properties: {
                    mensaje: { type: "string", example: "Usuario de recepción creado" },
                    usuario: {
                        type: "object",
                        properties: {
                            id: { type: "integer", example: 8 },
                            nombre: { type: "string", example: "María" },
                            apellido: { type: "string", example: "López" },
                            email: { type: "string", example: "maria@clinica.com" },
                            telefono: { type: "string", example: "5551234567" },
                            rol: { type: "string", example: "recepcionista" }
                        }
                    }
                }
            }
        }
    },
    paths: {
        "/api/recepcion": {
            get: {
                summary: "Listar usuarios de recepción (gerencia)",
                security: bearer,
                responses: {
                    "200": {
                        description: "Usuarios de recepción",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            id: { type: "integer", example: 8 },
                                            nombre: { type: "string", example: "María" },
                                            apellido: { type: "string", example: "López" },
                                            email: { type: "string", format: "email", example: "maria@clinica.com" },
                                            telefono: { type: "string", example: "5551234567" },
                                            rol: { type: "string", example: "recepcionista" }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "401": { description: "Se requiere un token válido" },
                    "403": { description: "Solo gerencia puede consultar usuarios de recepción" }
                }
            }
        },
        "/api/auth/login": {
            post: {
                summary: "Iniciar sesión y obtener JWT",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/LoginRequest" },
                            examples: {
                                loginValido: {
                                    summary: "Credenciales válidas",
                                    value: {
                                        email: "ana@clinica.com",
                                        contrasena: "PasswordSegura123"
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Sesión iniciada correctamente",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/LoginResponse" },
                                examples: {
                                    loginExitoso: {
                                        summary: "Respuesta exitosa",
                                        value: {
                                            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                                            usuario: {
                                                id: 3,
                                                nombre: "Ana",
                                                apellido: "García",
                                                email: "ana@clinica.com",
                                                rol: "recepcionista"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "401": {
                        description: "Credenciales incorrectas",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                                example: {
                                    mensaje: "Correo o contraseña incorrectos"
                                }
                            }
                        }
                    },
                    "500": {
                        description: "Error de configuración o autenticación",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                                example: {
                                    mensaje: "La autenticación no está configurada"
                                }
                            }
                        }
                    }
                }
            }
        },
        "/api/auth/usuarios/recepcion": {
            post: {
                summary: "Crear usuario de recepción (gerencia)",
                security: bearer,
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/UsuarioRecepcionRequest" },
                            examples: {
                                crearRecepcionista: {
                                    summary: "Usuarios de recepción",
                                    value: {
                                        nombre: "María",
                                        apellido: "López",
                                        email: "maria@clinica.com",
                                        telefono: "5551234567",
                                        contrasena: "PasswordSegura123"
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    "201": {
                        description: "Usuario de recepción creado",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/UsuarioRecepcionResponse" },
                                example: {
                                    mensaje: "Usuario de recepción creado",
                                    usuario: {
                                        id: 8,
                                        nombre: "María",
                                        apellido: "López",
                                        email: "maria@clinica.com",
                                        telefono: "5551234567",
                                        rol: "recepcionista"
                                    }
                                }
                            }
                        }
                    },
                    "400": {
                        description: "Datos inválidos",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                                example: {
                                    mensaje: "Los datos del usuario no son válidos"
                                }
                            }
                        }
                    },
                    "409": {
                        description: "Correo duplicado",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Error" },
                                example: {
                                    mensaje: "Ya existe un usuario con ese correo"
                                }
                            }
                        }
                    }
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
                    { name: "desde", in: "query", required: false, schema: { type: "string", format: "date" } },
                    { name: "hasta", in: "query", required: false, schema: { type: "string", format: "date" } }
                ],
                responses: { "200": { description: "Agenda completa o citas en el rango solicitado" } }
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
