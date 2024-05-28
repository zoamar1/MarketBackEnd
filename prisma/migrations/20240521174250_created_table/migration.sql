-- CreateTable
CREATE TABLE "Products" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "priceWithDiscount" REAL,
    "departmentId" INTEGER NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    CONSTRAINT "Products_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Departments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "storageProduct" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "size" TEXT NOT NULL,
    "storage" INTEGER NOT NULL,
    CONSTRAINT "storageProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
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
    "number" INTEGER NOT NULL,
    "complement" TEXT
);

-- CreateTable
CREATE TABLE "Customers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "loginId" INTEGER NOT NULL,
    "addressId" INTEGER,
    CONSTRAINT "Customers_loginId_fkey" FOREIGN KEY ("loginId") REFERENCES "Login" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Customers_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Addresses" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customersId" INTEGER NOT NULL,
    CONSTRAINT "Cart_customersId_fkey" FOREIGN KEY ("customersId") REFERENCES "Customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cartId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Orders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "productStorageId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    CONSTRAINT "Orders_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "loginId" INTEGER NOT NULL,
    "sector" TEXT NOT NULL,
    CONSTRAINT "Admin_loginId_fkey" FOREIGN KEY ("loginId") REFERENCES "Login" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Departments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Products_departmentId_key" ON "Products"("departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Customers_loginId_key" ON "Customers"("loginId");

-- CreateIndex
CREATE UNIQUE INDEX "Customers_addressId_key" ON "Customers"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_customersId_key" ON "Cart"("customersId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_loginId_key" ON "Admin"("loginId");
