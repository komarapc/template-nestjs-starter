/*
  Warnings:

  - You are about to drop the `models` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permissions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `permissions` DROP FOREIGN KEY `permissions_modelId_fkey`;

-- DropForeignKey
ALTER TABLE `permissions` DROP FOREIGN KEY `permissions_roleId_fkey`;

-- DropTable
DROP TABLE `models`;

-- DropTable
DROP TABLE `permissions`;
