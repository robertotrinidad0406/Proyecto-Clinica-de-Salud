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
            },
            PacienteRequest: {
                type: "object",
                required: ["nombre", "apellido", "fecha_de_nacimiento", "email"],
                properties: {
                    nombre: { type: "string", example: "Laura" },
                    apellido: { type: "string", example: "Martínez" },
                    fecha_de_nacimiento: { type: "string", format: "date", example: "1990-04-15" },
                    email: { type: "string", format: "email", example: "laura@correo.com" }
                }
            },
            PacienteExpediente: {
                allOf: [
                    { $ref: "#/components/schemas/Paciente" },
                    {
                        type: "object",
                        properties: {
                            citas: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        id: { type: "integer", example: 30 },
                                        fechaHora: { type: "string", format: "date-time" },
                                        Motivo: { type: "string", example: "Consulta de seguimiento" },
                                        estado: { type: "string", example: "completada" },
                                        PacientesId: { type: "integer", example: 12 },
                                        medicoId: { type: "integer", example: 6 },
                                        medico: { $ref: "#/components/schemas/Medico" }
                                    }
                                }
                            }
                        }
                    }
                ]
            },
            PacienteUpdateRequest: {
                type: "object",
                minProperties: 1,
                properties: {
                    nombre: { type: "string", example: "Laura" },
                    apellido: { type: "string", example: "Martínez" },
                    fecha_de_nacimiento: { type: "string", format: "date", example: "1990-04-15" },
                    email: { type: "string", format: "email", example: "laura@correo.com" },
                    createAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" }
                }
            },
            Paciente: {
                type: "object",
                properties: {
                    id: { type: "integer", example: 12 },
                    nombre: { type: "string", example: "Laura" },
                    apellido: { type: "string", example: "Martínez" },
                    fecha_de_nacimiento: { type: "string", format: "date-time", example: "1990-04-15T00:00:00.000Z" },
                    email: { type: "string", format: "email", example: "laura@correo.com" }
                }
            },
            PacienteMutationResponse: {
                type: "object",
                properties: {
                    message: { type: "string", example: "Paciente actualizado exitosamente" },
                    paciente: { $ref: "#/components/schemas/Paciente" }
                }
            },
            MedicoCreateRequest: {
                type: "object",
                required: ["NumeroLicencia", "usuario", "especialidad"],
                properties: {
                    NumeroLicencia: { type: "string", example: "MED-12345" },
                    usuario: {
                        type: "object",
                        required: ["nombre", "apellido", "email", "contrasena", "telefono"],
                        properties: {
                            nombre: { type: "string", example: "Carlos" },
                            apellido: { type: "string", example: "Ramírez" },
                            email: { type: "string", format: "email", example: "carlos@clinica.com" },
                            contrasena: { type: "string", format: "password", example: "PasswordSegura123" },
                            telefono: { type: "string", example: "5551234567" }
                        }
                    },
                    especialidad: {
                        type: "object",
                        required: ["nombre"],
                        properties: {
                            nombre: { type: "string", example: "Cardiología" },
                            descripcion: { type: "string", example: "Atención cardiovascular" }
                        }
                    }
                }
            },
            MedicoUpdateRequest: {
                type: "object",
                minProperties: 1,
                properties: {
                    NumeroLicencia: { type: "string", example: "MED-12345" },
                    userId: { type: "integer", example: 4 },
                    EspecialidadId: { type: "integer", example: 2 }
                }
            },
            Medico: {
                type: "object",
                properties: {
                    id: { type: "integer", example: 6 },
                    NumeroLicencia: { type: "string", example: "MED-12345" },
                    userId: { type: "integer", example: 4 },
                    EspecialidadId: { type: "integer", example: 2 },
                    createAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                    user: {
                        type: "object",
                        properties: {
                            id: { type: "integer", example: 4 },
                            nombre: { type: "string", example: "Carlos" },
                            apellido: { type: "string", example: "Ramírez" },
                            email: { type: "string", format: "email", example: "carlos@clinica.com" },
                            telefono: { type: "string", example: "5551234567" },
                            rol: { type: "string", example: "medico" },
                            createAt: { type: "string", format: "date-time" },
                            updatedAt: { type: "string", format: "date-time" }
                        }
                    },
                    especialidad: {
                        type: "object",
                        properties: {
                            id: { type: "integer", example: 2 },
                            nombre: { type: "string", example: "Cardiología" },
                            descripcion: { type: "string", nullable: true, example: "Atención cardiovascular" }
                        }
                    }
                }
            },
            MedicoMutationResponse: {
                type: "object",
                properties: {
                    mensaje: { type: "string", example: "Médico actualizado correctamente" },
                    medico: { $ref: "#/components/schemas/Medico" }
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
                responses: {
                    "200": {
                        description: "Lista de pacientes",
                        content: {
                            "application/json": {
                                schema: { type: "array", items: { $ref: "#/components/schemas/Paciente" } }
                            }
                        }
                    }
                }
            },
            post: {
                summary: "Registrar paciente (recepción)",
                security: bearer,
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/PacienteRequest" },
                            example: {
                                nombre: "Laura",
                                apellido: "Martínez",
                                fecha_de_nacimiento: "1990-04-15",
                                email: "laura@correo.com"
                            }
                        }
                    }
                },
                responses: {
                    "201": {
                        description: "Paciente creado",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/PacienteMutationResponse" },
                                example: {
                                    message: "Paciente creado exitosamente",
                                    paciente: {
                                        id: 12,
                                        nombre: "Laura",
                                        apellido: "Martínez",
                                        fecha_de_nacimiento: "1990-04-15T00:00:00.000Z",
                                        email: "laura@correo.com"
                                    }
                                }
                            }
                        }
                    },
                    "400": { description: "Datos del paciente inválidos" }
                }
            }
        },
        "/api/pacientes/{id}": {
            get: {
                summary: "Consultar expediente e historial de citas",
                security: bearer,
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
                responses: {
                    "200": {
                        description: "Expediente e historial de citas del paciente",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/PacienteExpediente" }
                            }
                        }
                    },
                    "404": { description: "Paciente no encontrado" }
                }
            },
            put: {
                summary: "Actualizar datos de un paciente (recepción)",
                security: bearer,
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/PacienteUpdateRequest" },
                            example: { email: "laura.actualizada@correo.com" }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Paciente actualizado",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/PacienteMutationResponse" },
                                example: {
                                    message: "Paciente actualizado exitosamente",
                                    paciente: {
                                        id: 12,
                                        nombre: "Laura",
                                        apellido: "Martínez",
                                        fecha_de_nacimiento: "1990-04-15",
                                        email: "laura.actualizada@correo.com"
                                    }
                                }
                            }
                        }
                    },
                    "400": { description: "ID o datos inválidos" },
                    "404": { description: "Paciente no encontrado" },
                    "409": { description: "No se puede actualizar el paciente por una referencia inválida" }
                }
            },
            delete: {
                summary: "Eliminar un paciente sin citas asociadas (recepción)",
                security: bearer,
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } }],
                responses: {
                    "200": {
                        description: "Paciente eliminado",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: { message: { type: "string", example: "Paciente eliminado exitosamente" } }
                                },
                                example: { message: "Paciente eliminado exitosamente" }
                            }
                        }
                    },
                    "404": { description: "Paciente no encontrado" },
                    "409": { description: "El paciente tiene citas asociadas" }
                }
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
                responses: {
                    "200": {
                        description: "Directorio médico",
                        content: {
                            "application/json": {
                                schema: { type: "array", items: { $ref: "#/components/schemas/Medico" } }
                            }
                        }
                    }
                }
            },
            post: {
                summary: "Registrar médico (gerencia)",
                security: bearer,
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/MedicoCreateRequest" },
                            example: {
                                NumeroLicencia: "MED-12345",
                                usuario: {
                                    nombre: "Carlos",
                                    apellido: "Ramírez",
                                    email: "carlos@clinica.com",
                                    contrasena: "PasswordSegura123",
                                    telefono: "5551234567"
                                },
                                especialidad: {
                                    nombre: "Cardiología",
                                    descripcion: "Atención cardiovascular"
                                }
                            }
                        }
                    }
                },
                responses: {
                    "201": {
                        description: "Médico creado",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/MedicoMutationResponse" },
                                example: {
                                    mensaje: "Médico creado correctamente",
                                    medico: {
                                        id: 6,
                                        NumeroLicencia: "MED-12345",
                                        userId: 4,
                                        EspecialidadId: 2,
                                        user: {
                                            id: 4,
                                            nombre: "Carlos",
                                            apellido: "Ramírez",
                                            email: "carlos@clinica.com",
                                            telefono: "5551234567",
                                            rol: "medico"
                                        },
                                        especialidad: {
                                            id: 2,
                                            nombre: "Cardiología",
                                            descripcion: "Atención cardiovascular"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "400": { description: "Datos del médico inválidos" },
                    "409": { description: "La licencia o el correo ya están registrados" }
                }
            }
        },
        "/api/medicos/{id}": {
            get: {
                summary: "Consultar médico por ID",
                security: bearer,
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } }],
                responses: {
                    "200": {
                        description: "Médico encontrado",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Medico" },
                                example: {
                                    id: 6,
                                    NumeroLicencia: "MED-12345",
                                    userId: 4,
                                    EspecialidadId: 2,
                                    user: {
                                        id: 4,
                                        nombre: "Carlos",
                                        apellido: "Ramírez",
                                        email: "carlos@clinica.com",
                                        telefono: "5551234567",
                                        rol: "medico"
                                    },
                                    especialidad: {
                                        id: 2,
                                        nombre: "Cardiología",
                                        descripcion: "Atención cardiovascular"
                                    }
                                }
                            }
                        }
                    },
                    "400": { description: "ID inválido" },
                    "404": { description: "Médico no encontrado" }
                }
            },
            put: {
                summary: "Actualizar médico (gerencia)",
                security: bearer,
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/MedicoUpdateRequest" },
                            example: { EspecialidadId: 3 }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Médico actualizado",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/MedicoMutationResponse" },
                                example: {
                                    mensaje: "Médico actualizado correctamente",
                                    medico: {
                                        id: 6,
                                        NumeroLicencia: "MED-12345",
                                        userId: 4,
                                        EspecialidadId: 3,
                                        user: {
                                            id: 4,
                                            nombre: "Carlos",
                                            apellido: "Ramírez",
                                            email: "carlos@clinica.com",
                                            telefono: "5551234567",
                                            rol: "medico"
                                        },
                                        especialidad: {
                                            id: 3,
                                            nombre: "Neurología",
                                            descripcion: "Atención neurológica"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "400": { description: "ID o datos inválidos" },
                    "404": { description: "Médico no encontrado" },
                    "409": { description: "Licencia o usuario ya registrados" }
                }
            },
            delete: {
                summary: "Eliminar médico sin citas asociadas (gerencia)",
                security: bearer,
                parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } }],
                responses: {
                    "200": {
                        description: "Médico eliminado",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: { mensaje: { type: "string", example: "Médico eliminado correctamente" } }
                                },
                                example: { mensaje: "Médico eliminado correctamente" }
                            }
                        }
                    },
                    "404": { description: "Médico no encontrado" },
                    "409": { description: "El médico tiene citas asociadas" }
                }
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
