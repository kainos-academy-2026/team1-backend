import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
	throw new Error('DATABASE_URL is not set');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  await prisma.jobRole.createMany({
    data: [
        { jobRoleId: 1, roleName: "Software Engineer", location: "New York", capabilityId: 1, bandId: 2, closingDate: new Date("2024-12-31"), status: "open" },
        { jobRoleId: 2, roleName: "Data Scientist", location: "San Francisco", capabilityId: 2, bandId: 3, closingDate: new Date("2024-11-30"), status: "open" },
        { jobRoleId: 3, roleName: "Product Manager", location: "Chicago", capabilityId: 3, bandId: 4, closingDate: new Date("2024-10-31"), status: "closed" },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
