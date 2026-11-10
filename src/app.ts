import express from "express";
import cors from "cors";
import pacientesRoutes from "./routes/pacientesRoutes";

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

export default app;
