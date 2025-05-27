/*
  Warnings:

  - You are about to drop the column `datetime` on the `Slot` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[date,time_slot]` on the table `Slot` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `Slot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time_slot` to the `Slot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Slot" DROP COLUMN "datetime",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "date" TEXT NOT NULL,
ADD COLUMN     "time_slot" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "UrgentRequest" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UrgentRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Slot_date_time_slot_key" ON "Slot"("date", "time_slot");
