# Verificación manual del flujo de la API

Ejecuta estos pasos contra una base de datos de pruebas, nunca contra datos de producción.
Configura las variables de `.env.example` en `.env` con una base de datos y secretos propios,
y luego prepara la base y el usuario inicial:

```powershell
pnpm exec prisma migrate deploy
pnpm seed:gerencia
pnpm dev
```

Los endpoints también se pueden ejecutar desde Swagger UI en `/api/docs`. Conserva los tokens
solo durante la prueba y usa los IDs devueltos por la API.

1. **Registro de usuarios:** inicia sesión como gerencia en `POST /api/auth/login` con el usuario
   semilla. Usa su token para crear un usuario de recepción en
   `POST /api/auth/usuarios/recepcion` y un médico en `POST /api/medicos`. El registro del médico
   debe rechazar un correo ausente o inválido.
2. **Inicio de sesión:** inicia sesión con los correos y contraseñas de recepción y del médico.
   Ambos deben recibir un token; una contraseña incorrecta debe recibir `401`.
3. **Crear paciente:** con el token de recepción, crea un paciente en `POST /api/pacientes`.
   Comprueba que los datos devueltos contienen el nuevo ID.
4. **Agendar cita:** con el mismo token, envía `POST /api/citas` con los IDs del paciente y
   médico, una fecha futura en `fechaHora` y un `motivo`. Debe responder `201`. Repite la misma
   combinación de médico y fecha/hora: debe responder `409`.
5. **Actualizar estado:** consulta `GET /api/citas/mi-agenda` con el token del médico y cambia
   la cita a `completada` o `cancelada` en `PATCH /api/citas/{id}/estado`. Una cita de otro
   médico no debe poder modificarse.
6. **Reportes:** con el token de gerencia consulta `GET /api/reportes/citas-por-especialidad`
   y `GET /api/reportes/citas-diarias?fecha=YYYY-MM-DD`. La fecha diaria debe rechazar formatos
   inválidos y fechas inexistentes con `400`.

Una cita cancelada libera su fecha/hora para volver a agendarla. El esquema actual no define la
duración de una cita, por lo que la prevención de solapamientos distintos de una fecha/hora de
inicio idéntica no se puede afirmar ni probar hasta que se establezca esa regla de negocio.
