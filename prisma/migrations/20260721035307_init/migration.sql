-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "authentications" (
    "token" TEXT NOT NULL,

    CONSTRAINT "authentications_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "albums" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "coverUrl" TEXT,

    CONSTRAINT "albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "songs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "performer" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "duration" INTEGER,
    "albumId" TEXT,

    CONSTRAINT "songs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playlists" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "playlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playlist_songs" (
    "id" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,

    CONSTRAINT "playlist_songs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collaborations" (
    "id" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "collaborations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "album_likes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,

    CONSTRAINT "album_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playlist_song_activities" (
    "id" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "playlist_song_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "playlist_songs_playlistId_songId_key" ON "playlist_songs"("playlistId", "songId");

-- CreateIndex
CREATE UNIQUE INDEX "collaborations_playlistId_userId_key" ON "collaborations"("playlistId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "album_likes_userId_albumId_key" ON "album_likes"("userId", "albumId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "songs" ADD CONSTRAINT "songs_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlists" ADD CONSTRAINT "playlists_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlist_songs" ADD CONSTRAINT "playlist_songs_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "playlists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlist_songs" ADD CONSTRAINT "playlist_songs_songId_fkey" FOREIGN KEY ("songId") REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collaborations" ADD CONSTRAINT "collaborations_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "playlists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collaborations" ADD CONSTRAINT "collaborations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "album_likes" ADD CONSTRAINT "album_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "album_likes" ADD CONSTRAINT "album_likes_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlist_song_activities" ADD CONSTRAINT "playlist_song_activities_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "playlists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlist_song_activities" ADD CONSTRAINT "playlist_song_activities_songId_fkey" FOREIGN KEY ("songId") REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlist_song_activities" ADD CONSTRAINT "playlist_song_activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
