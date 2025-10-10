-- AlterTable
ALTER TABLE "Channel" ADD COLUMN "archivedAt" DATETIME;
ALTER TABLE "Channel" ADD COLUMN "createdByUserId" TEXT;
ALTER TABLE "Channel" ADD COLUMN "deletedAt" DATETIME;
