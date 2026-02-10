/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `accountId` on the `Donation` table. All the data in the column will be lost.
  - You are about to drop the column `accountId` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `accountId` on the `Revenue` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Account";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "organizationName" TEXT NOT NULL DEFAULT '24Studio Foundation',
    "organizationAddress" TEXT NOT NULL DEFAULT 'Dhaka, Bangladesh',
    "organizationEmail" TEXT NOT NULL DEFAULT 'info@24studio.org',
    "organizationPhone" TEXT NOT NULL DEFAULT '+880 XXX XXXX',
    "organizationWebsite" TEXT NOT NULL DEFAULT 'https://24studio.org',
    "currency" TEXT NOT NULL DEFAULT 'BDT',
    "currencySymbol" TEXT NOT NULL DEFAULT '৳',
    "dateFormat" TEXT NOT NULL DEFAULT 'DD/MM/YYYY',
    "fiscalYearStart" INTEGER NOT NULL DEFAULT 1,
    "fiscalYearEnd" INTEGER NOT NULL DEFAULT 12,
    "revenueCategories" TEXT NOT NULL DEFAULT 'Course Fees,Training,Consulting,Grants,Corporate,Projects,Other',
    "expenseCategories" TEXT NOT NULL DEFAULT 'Salaries,Rent,Utilities,Supplies,Marketing,Training,Equipment,Transport,Admin,Misc',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Donation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "donorId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "amount" DECIMAL NOT NULL,
    "type" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "transactionId" TEXT,
    "purpose" TEXT,
    "taxReceiptRequired" BOOLEAN NOT NULL,
    "taxReceiptSent" BOOLEAN NOT NULL DEFAULT false,
    "receiptPath" TEXT,
    "recordedById" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Donation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Donation_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Donation" ("amount", "createdAt", "date", "donorId", "id", "paymentMethod", "purpose", "receiptPath", "recordedById", "taxReceiptRequired", "taxReceiptSent", "type") SELECT "amount", "createdAt", "date", "donorId", "id", "paymentMethod", "purpose", "receiptPath", "recordedById", "taxReceiptRequired", "taxReceiptSent", "type" FROM "Donation";
DROP TABLE "Donation";
ALTER TABLE "new_Donation" RENAME TO "Donation";
CREATE TABLE "new_Donor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "nationalId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'External',
    "yearlyContributionRequired" DECIMAL,
    "totalDonated" DECIMAL NOT NULL DEFAULT 0,
    "lastDonationDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Donor" ("address", "createdAt", "email", "id", "lastDonationDate", "name", "nationalId", "phone", "totalDonated") SELECT "address", "createdAt", "email", "id", "lastDonationDate", "name", "nationalId", "phone", "totalDonated" FROM "Donor";
DROP TABLE "Donor";
ALTER TABLE "new_Donor" RENAME TO "Donor";
CREATE TABLE "new_Expense" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "amount" DECIMAL NOT NULL,
    "category" TEXT NOT NULL,
    "vendor" TEXT,
    "paymentMethod" TEXT NOT NULL,
    "transactionId" TEXT,
    "description" TEXT,
    "receiptPath" TEXT,
    "status" TEXT NOT NULL,
    "recordedById" INTEGER NOT NULL,
    "approvedById" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Expense_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Expense_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Expense" ("amount", "approvedById", "category", "createdAt", "date", "description", "id", "paymentMethod", "receiptPath", "recordedById", "status", "vendor") SELECT "amount", "approvedById", "category", "createdAt", "date", "description", "id", "paymentMethod", "receiptPath", "recordedById", "status", "vendor" FROM "Expense";
DROP TABLE "Expense";
ALTER TABLE "new_Expense" RENAME TO "Expense";
CREATE TABLE "new_Revenue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "amount" DECIMAL NOT NULL,
    "category" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "transactionId" TEXT,
    "programName" TEXT,
    "description" TEXT,
    "receiptPath" TEXT,
    "status" TEXT NOT NULL,
    "recordedById" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Revenue_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Revenue" ("amount", "category", "createdAt", "date", "description", "id", "paymentMethod", "programName", "receiptPath", "recordedById", "source", "status") SELECT "amount", "category", "createdAt", "date", "description", "id", "paymentMethod", "programName", "receiptPath", "recordedById", "source", "status" FROM "Revenue";
DROP TABLE "Revenue";
ALTER TABLE "new_Revenue" RENAME TO "Revenue";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
