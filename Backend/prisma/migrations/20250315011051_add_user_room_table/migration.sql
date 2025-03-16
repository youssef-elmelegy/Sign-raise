/*
  Warnings:

  - You are about to drop the column `googleId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_googleId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "googleId";

-- CreateTable
CREATE TABLE "UserRoom" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRoom_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserRoom" ADD CONSTRAINT "UserRoom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
