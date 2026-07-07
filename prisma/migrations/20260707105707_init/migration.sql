-- CreateTable
CREATE TABLE "JobRole" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "capability" TEXT NOT NULL,
    "band" TEXT NOT NULL,
    "closingDate" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "JobRole_pkey" PRIMARY KEY ("id")
);
