/*
  Warnings:

  - You are about to drop the `JobRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "JobRole";

-- CreateTable
CREATE TABLE "job_roles" (
    "jobRoleId" SERIAL NOT NULL,
    "roleName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "capabilityId" INTEGER NOT NULL,
    "bandId" INTEGER NOT NULL,
    "closingDate" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "job_roles_pkey" PRIMARY KEY ("jobRoleId")
);

-- CreateTable
CREATE TABLE "capability" (
    "capabilityId" SERIAL NOT NULL,
    "capabilityName" TEXT NOT NULL,

    CONSTRAINT "capability_pkey" PRIMARY KEY ("capabilityId")
);

-- CreateTable
CREATE TABLE "band" (
    "bandId" SERIAL NOT NULL,
    "bandName" TEXT NOT NULL,

    CONSTRAINT "band_pkey" PRIMARY KEY ("bandId")
);

-- AddForeignKey
ALTER TABLE "job_roles" ADD CONSTRAINT "job_roles_capabilityId_fkey" FOREIGN KEY ("capabilityId") REFERENCES "capability"("capabilityId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_roles" ADD CONSTRAINT "job_roles_bandId_fkey" FOREIGN KEY ("bandId") REFERENCES "band"("bandId") ON DELETE RESTRICT ON UPDATE CASCADE;
