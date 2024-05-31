/*
  Warnings:

  - You are about to drop the `Administrators` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Administrators";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Admin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "emailId" INTEGER NOT NULL,
    "sector" TEXT NOT NULL,
    CONSTRAINT "Admin_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "Login" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_emailId_key" ON "Admin"("emailId");
