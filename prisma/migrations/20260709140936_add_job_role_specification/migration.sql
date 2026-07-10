/*
  Warnings:

  - Added the required column `specification` to the `job_roles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "job_roles" ADD COLUMN     "specification" TEXT NOT NULL;
