-- Alter enum-backed columns to plain text
ALTER TABLE "job_roles"
ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "users"
ALTER COLUMN "role" DROP DEFAULT;

ALTER TABLE "job_roles"
ALTER COLUMN "status" TYPE TEXT USING "status"::TEXT;

ALTER TABLE "users"
ALTER COLUMN "role" TYPE TEXT USING "role"::TEXT;

-- Enum types are no longer used by Prisma schema
DROP TYPE IF EXISTS "JobRoleStatus";
DROP TYPE IF EXISTS "UserRole";
