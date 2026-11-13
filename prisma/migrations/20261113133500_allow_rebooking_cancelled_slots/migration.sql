DROP INDEX IF EXISTS "citas_medicoId_fechaHora_key";

CREATE UNIQUE INDEX "citas_medicoId_fechaHora_activa_key"
ON "citas"("medicoId", "fechaHora")
WHERE "estado" <> 'cancelada';
