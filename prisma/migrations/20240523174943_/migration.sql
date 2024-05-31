/*
  Warnings:

  - You are about to drop the `productsForSale` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `productForSaleId` on the `storageProduct` table. All the data in the column will be lost.
  - Added the required column `productId` to the `storageProduct` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "productsForSale";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_storageProduct" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "size" TEXT NOT NULL,
    "storage" INTEGER NOT NULL,
    CONSTRAINT "storageProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_storageProduct" ("id", "size", "storage") SELECT "id", "size", "storage" FROM "storageProduct";
DROP TABLE "storageProduct";
ALTER TABLE "new_storageProduct" RENAME TO "storageProduct";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
