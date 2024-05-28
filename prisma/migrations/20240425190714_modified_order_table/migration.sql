/*
  Warnings:

  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Email` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Address";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Email";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Order";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Product";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Products" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "discount" REAL,
    "departamentId" INTEGER NOT NULL,
    "description" TEXT,
    "image" BLOB NOT NULL,
    "color" TEXT NOT NULL,
    CONSTRAINT "Products_departamentId_fkey" FOREIGN KEY ("departamentId") REFERENCES "Departaments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Login" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Addresses" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "zip_code" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "complement" TEXT,
    "number" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Orders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    CONSTRAINT "Orders_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Departaments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Administrators" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "emailId" INTEGER NOT NULL,
    "sector" TEXT NOT NULL,
    CONSTRAINT "Administrators_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "Login" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Administrators" ("emailId", "id", "name", "sector") SELECT "emailId", "id", "name", "sector" FROM "Administrators";
DROP TABLE "Administrators";
ALTER TABLE "new_Administrators" RENAME TO "Administrators";
CREATE UNIQUE INDEX "Administrators_emailId_key" ON "Administrators"("emailId");
CREATE TABLE "new_storageProduct" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "size" TEXT NOT NULL,
    "storage" TEXT NOT NULL,
    CONSTRAINT "storageProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_storageProduct" ("id", "productId", "size", "storage") SELECT "id", "productId", "size", "storage" FROM "storageProduct";
DROP TABLE "storageProduct";
ALTER TABLE "new_storageProduct" RENAME TO "storageProduct";
CREATE TABLE "new_Customers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "emailId" INTEGER NOT NULL,
    "addressId" INTEGER,
    CONSTRAINT "Customers_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "Login" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Customers_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Addresses" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Customers" ("addressId", "emailId", "id", "name") SELECT "addressId", "emailId", "id", "name" FROM "Customers";
DROP TABLE "Customers";
ALTER TABLE "new_Customers" RENAME TO "Customers";
CREATE UNIQUE INDEX "Customers_emailId_key" ON "Customers"("emailId");
CREATE UNIQUE INDEX "Customers_addressId_key" ON "Customers"("addressId");
CREATE TABLE "new_CartItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cartId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CartItem" ("cartId", "id", "productId") SELECT "cartId", "id", "productId" FROM "CartItem";
DROP TABLE "CartItem";
ALTER TABLE "new_CartItem" RENAME TO "CartItem";
CREATE UNIQUE INDEX "CartItem_cartId_key" ON "CartItem"("cartId");
CREATE UNIQUE INDEX "CartItem_productId_key" ON "CartItem"("productId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Products_departamentId_key" ON "Products"("departamentId");
