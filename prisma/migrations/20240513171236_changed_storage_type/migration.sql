/*
  Warnings:

  - You are about to alter the column `storage` on the `storageProduct` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_storageProduct" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "size" TEXT NOT NULL,
    "storage" INTEGER NOT NULL,
    CONSTRAINT "storageProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_storageProduct" ("id", "productId", "size", "storage") SELECT "id", "productId", "size", "storage" FROM "storageProduct";
DROP TABLE "storageProduct";
ALTER TABLE "new_storageProduct" RENAME TO "storageProduct";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
