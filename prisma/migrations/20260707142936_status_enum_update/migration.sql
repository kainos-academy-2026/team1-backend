/*
  Warnings:

  - Changed the type of `status` on the `job_roles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "JobRoleStatus" AS ENUM ('OPEN', 'CLOSED');

-- AlterTable
ALTER TABLE "job_roles" DROP COLUMN "status",
ADD COLUMN     "status" "JobRoleStatus" NOT NULL;
