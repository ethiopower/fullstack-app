/*
  Warnings:

  - Added the required column `password` to the `WarehouseWorker` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WarehouseWorker" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_WarehouseWorker" ("createdAt", "email", "firstName", "id", "lastName", "phone", "role", "updatedAt") SELECT "createdAt", "email", "firstName", "id", "lastName", "phone", "role", "updatedAt" FROM "WarehouseWorker";
DROP TABLE "WarehouseWorker";
ALTER TABLE "new_WarehouseWorker" RENAME TO "WarehouseWorker";
CREATE UNIQUE INDEX "WarehouseWorker_email_key" ON "WarehouseWorker"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
