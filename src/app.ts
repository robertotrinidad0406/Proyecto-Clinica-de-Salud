import express from "express";
import cors from "cors";
import pacientesRoutes from "./routes/pacientesRoutes.js";
import medicoRoutes from "./routes/medicoRoutes.js";

const app: express.Application = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Bienvenido a la Clinica de Salud Trinidad",
        estado: "Servidor funcionando correctamente"
    });
});

app.use("/api/pacientes", pacientesRoutes);
app.use("/api/medicos", medicoRoutes);

export default app;
