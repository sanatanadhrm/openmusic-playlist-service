import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";
import { config } from "@/commons/config";
const adapter = new PrismaPg({
    connectionString: config.database.url,
});
export const postgresql = new PrismaClient({ adapter });

