import express from "express";
import cors from "cors";
import pacientesRoutes from "./routes/pacientesRoutes.js";
import medicoRoutes from "./routes/medicoRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import citasRoutes from "./routes/citasRoutes.js";
import reportesRoutes from "./routes/reportesRoutes.js";
import swaggerUi from "swagger-ui-express";
import { openApiSpec } from "./docs/openApi.js";

const app: express.Application = express();

app.use(cors());
app.use(express.json());
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.get("/", (req, res) => {
    res.json({
        message: "Bienvenido a la Clinica de Salud Trinidad",
        estado: "Servidor funcionando correctamente"
    });
});

app.use("/api/pacientes", pacientesRoutes);
app.use("/api/medicos", medicoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/citas", citasRoutes);
app.use("/api/reportes", reportesRoutes);

export default app;
