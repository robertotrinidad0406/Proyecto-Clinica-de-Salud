-- CreateEnum

CREATE TYPE "Rol" AS ENUM ('recepcionista',
                           'medico',
                           'gerencia');

-- CreateEnum

CREATE TYPE "EstadoCita" AS ENUM ('programada',
                                  'en_espera',
                                  'completada',
                                  'cancelada');

-- CreateTable

CREATE TABLE "Users" ("id" SERIAL NOT NULL,
                                  "nombre" TEXT NOT NULL,
                                                "apellido" TEXT NOT NULL,
                                                                "email" TEXT, "contraseña" TEXT NOT NULL,
                                                                                                "telefono" TEXT NOT NULL,
                                                                                                                "rol" "Rol" NOT NULL,
                                                                                                                            "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                                                                                                                                                     "updatedAt" TIMESTAMP(3) NOT NULL,
                                                                                                                                                                                              CONSTRAINT "Users_pkey" PRIMARY KEY ("id"));

-- CreateTable

CREATE TABLE "Pacientes" ("id" SERIAL NOT NULL,
                                      "nombre" TEXT NOT NULL,
                                                    "apellido" TEXT NOT NULL,
                                                                    "fecha_de_nacimiento" DATE NOT NULL,
                                                                                               "email" TEXT, "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                                                                                                                                      "updatedAt" TIMESTAMP(3) NOT NULL,
                                                                                                                                                                               CONSTRAINT "Pacientes_pkey" PRIMARY KEY ("id"));

-- CreateTable

CREATE TABLE "Especialidades" ("id" SERIAL NOT NULL,
                                           "nombre" TEXT NOT NULL,
                                                         "descripcion" TEXT, "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                                                                                                      CONSTRAINT "Especialidades_pkey" PRIMARY KEY ("id"));

-- CreateTable

CREATE TABLE "medicos" ("id" SERIAL NOT NULL,
                                    "NumeroLicencia" TEXT NOT NULL,
                                                          "userId" INTEGER NOT NULL,
                                                                           "EspecialidadId" INTEGER NOT NULL,
                                                                                                    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                                                                                                                             "updatedAt" TIMESTAMP(3) NOT NULL,
                                                                                                                                                                      CONSTRAINT "medicos_pkey" PRIMARY KEY ("id"));

-- CreateTable

CREATE TABLE "citas" ("id" SERIAL NOT NULL,
                                  "fechaHora" TIMESTAMP(3) NOT NULL,
                                                           "Motivo" TEXT NOT NULL,
                                                                         "estado" "EstadoCita" NOT NULL DEFAULT 'programada',
                                                                                                                "PacientesId" INTEGER NOT NULL,
                                                                                                                                      "medicoId" INTEGER NOT NULL,
                                                                                                                                                         "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                                                                                                                                                                                  "updatedAt" TIMESTAMP(3) NOT NULL,
                                                                                                                                                                                                                           CONSTRAINT "citas_pkey" PRIMARY KEY ("id"));

-- CreateIndex

CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex

CREATE UNIQUE INDEX "Especialidades_nombre_key" ON "Especialidades"("nombre");

-- CreateIndex

CREATE UNIQUE INDEX "medicos_NumeroLicencia_key" ON "medicos"("NumeroLicencia");

-- CreateIndex

CREATE UNIQUE INDEX "medicos_userId_key" ON "medicos"("userId");

-- CreateIndex

CREATE INDEX "citas_PacientesId_idx" ON "citas"("PacientesId");

-- CreateIndex

CREATE INDEX "citas_medicoId_fechaHora_idx" ON "citas"("medicoId",
                                                       "fechaHora");

-- CreateIndex

CREATE INDEX "citas_fechaHora_estado_idx" ON "citas"("fechaHora",
                                                     "estado");

-- AddForeignKey

ALTER TABLE "medicos" ADD CONSTRAINT "medicos_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "Users"("id") ON
DELETE RESTRICT ON
UPDATE CASCADE;

-- AddForeignKey

ALTER TABLE "medicos" ADD CONSTRAINT "medicos_EspecialidadId_fkey"
FOREIGN KEY ("EspecialidadId") REFERENCES "Especialidades"("id") ON
DELETE RESTRICT ON
UPDATE CASCADE;

-- AddForeignKey

ALTER TABLE "citas" ADD CONSTRAINT "citas_PacientesId_fkey"
FOREIGN KEY ("PacientesId") REFERENCES "Pacientes"("id") ON
DELETE RESTRICT ON
UPDATE CASCADE;

-- AddForeignKey

ALTER TABLE "citas" ADD CONSTRAINT "citas_medicoId_fkey"
FOREIGN KEY ("medicoId") REFERENCES "medicos"("id") ON
DELETE RESTRICT ON
UPDATE CASCADE;