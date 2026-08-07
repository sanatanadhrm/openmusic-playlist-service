/*
  Warnings:

  - You are about to drop the `album_likes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `albums` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `songs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "album_likes" DROP CONSTRAINT "album_likes_albumId_fkey";

-- DropForeignKey
ALTER TABLE "playlist_song_activities" DROP CONSTRAINT "playlist_song_activities_songId_fkey";

-- DropForeignKey
ALTER TABLE "playlist_songs" DROP CONSTRAINT "playlist_songs_songId_fkey";

-- DropForeignKey
ALTER TABLE "songs" DROP CONSTRAINT "songs_albumId_fkey";

-- DropTable
DROP TABLE "album_likes";

-- DropTable
DROP TABLE "albums";

-- DropTable
DROP TABLE "songs";

-- CreateTable
CREATE TABLE "cached_songs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "performer" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "duration" INTEGER,
    "albumId" TEXT,

    CONSTRAINT "cached_songs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "playlist_songs" ADD CONSTRAINT "playlist_songs_songId_fkey" FOREIGN KEY ("songId") REFERENCES "cached_songs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlist_song_activities" ADD CONSTRAINT "playlist_song_activities_songId_fkey" FOREIGN KEY ("songId") REFERENCES "cached_songs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
