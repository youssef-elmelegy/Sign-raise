/*
  Warnings:

  - You are about to drop the column `roomId` on the `UserRoom` table. All the data in the column will be lost.
  - Added the required column `roomName` to the `UserRoom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserRoom" DROP COLUMN "roomId",
ADD COLUMN     "roomName" TEXT NOT NULL;
