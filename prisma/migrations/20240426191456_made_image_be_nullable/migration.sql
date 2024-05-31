-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Products" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "discount" REAL,
    "departamentId" INTEGER NOT NULL,
    "image" TEXT,
    "description" TEXT,
    "color" TEXT NOT NULL,
    CONSTRAINT "Products_departamentId_fkey" FOREIGN KEY ("departamentId") REFERENCES "Departaments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Products" ("color", "departamentId", "description", "discount", "id", "image", "name", "price") SELECT "color", "departamentId", "description", "discount", "id", "image", "name", "price" FROM "Products";
DROP TABLE "Products";
ALTER TABLE "new_Products" RENAME TO "Products";
CREATE UNIQUE INDEX "Products_departamentId_key" ON "Products"("departamentId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
