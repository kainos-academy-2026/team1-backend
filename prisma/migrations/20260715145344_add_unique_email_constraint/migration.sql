/*
  Warnings:

  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('OPEN', 'CLOSED', 'IN_PROGRESS');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "job_roles" ALTER COLUMN "specification" DROP DEFAULT,
ALTER COLUMN "description" DROP DEFAULT,
ALTER COLUMN "responsibilities" DROP DEFAULT,
ALTER COLUMN "numberOfOpenPositions" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "Application" (
    "applicationId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "jobRoleId" INTEGER NOT NULL,
    "cvURL" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'IN_PROGRESS',
    "dateApplied" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("applicationId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobRoleId_fkey" FOREIGN KEY ("jobRoleId") REFERENCES "job_roles"("jobRoleId") ON DELETE RESTRICT ON UPDATE CASCADE;
