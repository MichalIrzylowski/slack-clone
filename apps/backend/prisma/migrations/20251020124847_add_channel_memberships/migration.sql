-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Channel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" DATETIME,
    "archivedAt" DATETIME,
    "createdByUserId" TEXT
);
INSERT INTO "new_Channel" ("archivedAt", "createdAt", "createdByUserId", "deletedAt", "id", "isPrivate", "name", "updatedAt") SELECT "archivedAt", "createdAt", "createdByUserId", "deletedAt", "id", "isPrivate", "name", "updatedAt" FROM "Channel";
DROP TABLE "Channel";
ALTER TABLE "new_Channel" RENAME TO "Channel";
CREATE UNIQUE INDEX "Channel_name_key" ON "Channel"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
