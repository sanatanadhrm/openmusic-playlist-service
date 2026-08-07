// prisma/seed.ts
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/Infrastructures/database/postgresql/generated/prisma/client";

import bcrypt from "bcrypt";
import "dotenv/config";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
    // 1. Seed Roles
    const roles = [
        { name: "super_admin", description: "Akses penuh ke seluruh sistem, termasuk manajemen role dan admin lain" },
        { name: "admin", description: "Mengelola data master (albums, songs) dan moderasi konten" },
        { name: "user", description: "Pengguna biasa — bisa membuat playlist, like album, kolaborasi" },
    ];

    for (const role of roles) {
        await prisma.role.upsert({
            where: { name: role.name },
            update: {},
            create: role,
        });
    }
    console.log("Seed roles selesai:", roles.map((r) => r.name).join(", "));

    const superAdminRole = await prisma.role.findUniqueOrThrow({ where: { name: "super_admin" } });
    const adminRole = await prisma.role.findUniqueOrThrow({ where: { name: "admin" } });
    const userRole = await prisma.role.findUniqueOrThrow({ where: { name: "user" } });

    // 2. Seed Users (3 level role)
    const hashedPassword = await bcrypt.hash("password123", 10);

    const superAdmin = await prisma.user.upsert({
        where: { username: "superadmin" },
        update: {},
        create: {
            username: "superadmin",
            password: hashedPassword,
            fullname: "Super Admin",
            roleId: superAdminRole.id,
        },
    });

    const admin = await prisma.user.upsert({
        where: { username: "admin" },
        update: {},
        create: {
            username: "admin",
            password: hashedPassword,
            fullname: "Admin OpenMusic",
            roleId: adminRole.id,
        },
    });

    const johndoe = await prisma.user.upsert({
        where: { username: "johndoe" },
        update: {},
        create: {
            username: "johndoe",
            password: hashedPassword,
            fullname: "John Doe",
            roleId: userRole.id,
        },
    });

    const janedoe = await prisma.user.upsert({
        where: { username: "janedoe" },
        update: {},
        create: {
            username: "janedoe",
            password: hashedPassword,
            fullname: "Jane Doe",
            roleId: userRole.id,
        },
    });

    console.log("Seed users selesai:", [superAdmin.username, admin.username, johndoe.username, janedoe.username].join(", "));

    // 3. Seed Albums
    const albumsData = [
        { name: "Viva la Vida", year: 2008, coverUrl: "https://example.com/covers/viva-la-vida.jpg" },
        { name: "A Rush of Blood to the Head", year: 2002, coverUrl: "https://example.com/covers/rush-of-blood.jpg" },
        { name: "÷ (Divide)", year: 2017, coverUrl: "https://example.com/covers/divide.jpg" },
        { name: "Random Access Memories", year: 2013, coverUrl: null },
    ];

    const albums = [];
    for (const albumData of albumsData) {
        // findFirst dulu karena Album tidak punya field unique selain id (cuid random)
        let album = await prisma.album.findFirst({ where: { name: albumData.name, year: albumData.year } });
        if (!album) {
            album = await prisma.album.create({ data: albumData });
        }
        albums.push(album);
    }
    console.log("Seed albums selesai:", albums.map((a) => a.name).join(", "));

    // 4. Seed Songs
    const songsData = [
        { title: "Viva la Vida", year: 2008, performer: "Coldplay", genre: "Alternative Rock", duration: 242, albumId: albums[0].id },
        { title: "Life in Technicolor", year: 2008, performer: "Coldplay", genre: "Alternative Rock", duration: 121, albumId: albums[0].id },
        { title: "The Scientist", year: 2002, performer: "Coldplay", genre: "Alternative Rock", duration: 309, albumId: albums[1].id },
        { title: "Clocks", year: 2002, performer: "Coldplay", genre: "Alternative Rock", duration: 307, albumId: albums[1].id },
        { title: "Shape of You", year: 2017, performer: "Ed Sheeran", genre: "Pop", duration: 233, albumId: albums[2].id },
        { title: "Perfect", year: 2017, performer: "Ed Sheeran", genre: "Pop", duration: 263, albumId: albums[2].id },
        { title: "Get Lucky", year: 2013, performer: "Daft Punk", genre: "Funk", duration: 369, albumId: albums[3].id },
        { title: "Single Tanpa Album", year: 2023, performer: "Independent Artist", genre: "Indie", duration: 195, albumId: null },
    ];

    for (const songData of songsData) {
        const existing = await prisma.song.findFirst({
            where: { title: songData.title, performer: songData.performer },
        });
        if (!existing) {
            await prisma.song.create({ data: songData });
        }
    }
    console.log("Seed songs selesai:", songsData.length, "lagu");

    console.log("Semua seed selesai dijalankan.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });