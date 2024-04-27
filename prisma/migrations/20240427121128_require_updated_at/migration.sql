/*
  Warnings:

  - Made the column `updatedAt` on table `Link` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Link" ALTER COLUMN "updatedAt" SET NOT NULL;
