/*
  Warnings:

  - You are about to drop the `authentications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "album_likes" DROP CONSTRAINT "album_likes_userId_fkey";

-- DropForeignKey
ALTER TABLE "collaborations" DROP CONSTRAINT "collaborations_userId_fkey";

-- DropForeignKey
ALTER TABLE "playlist_song_activities" DROP CONSTRAINT "playlist_song_activities_userId_fkey";

-- DropForeignKey
ALTER TABLE "playlists" DROP CONSTRAINT "playlists_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_roleId_fkey";

-- DropTable
DROP TABLE "authentications";

-- DropTable
DROP TABLE "roles";

-- DropTable
DROP TABLE "users";
