/*
  Warnings:

  - Added the required column `description` to the `job_roles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfOpenPositions` to the `job_roles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responsibilities` to the `job_roles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- AlterTable
ALTER TABLE "job_roles"
ADD COLUMN "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN "responsibilities" TEXT NOT NULL DEFAULT '',
ADD COLUMN "numberOfOpenPositions" INTEGER NOT NULL DEFAULT 0;
