/*
  Warnings:

  - You are about to drop the column `cover_url` on the `articles` table. All the data in the column will be lost.
  - Added the required column `category` to the `articles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `excerpt` to the `articles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "articles" DROP COLUMN "cover_url",
ADD COLUMN     "author" TEXT NOT NULL DEFAULT 'Matheus Kops Guedes',
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "excerpt" TEXT NOT NULL,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "published_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "read_time" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;
