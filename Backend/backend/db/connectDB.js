import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Prisma Connected to the Database");
  } catch (error) {
    console.log("Error connecting to the database: ", error.message);
    process.exit(1);
  }
};

export default prisma;
