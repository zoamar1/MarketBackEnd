/*
  Warnings:

  - You are about to drop the column `departamentId` on the `Products` table. All the data in the column will be lost.
  - Added the required column `departmentId` to the `Products` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Products" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "discount" REAL,
    "departmentId" INTEGER NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    CONSTRAINT "Products_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Departments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Products" ("color", "description", "discount", "id", "name", "price", "slug") SELECT "color", "description", "discount", "id", "name", "price", "slug" FROM "Products";
DROP TABLE "Products";
ALTER TABLE "new_Products" RENAME TO "Products";
CREATE UNIQUE INDEX "Products_departmentId_key" ON "Products"("departmentId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
