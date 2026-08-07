// src/Infrastructures/message/rabbitmq/song-consumer.ts
// Consumer RabbitMQ untuk mensinkronisasi CachedSong dari Catalog Service

import { PrismaClient } from "@/Infrastructures/database/postgresql/generated/prisma/client";
import { rabbitMQConnection } from "./rabbitmq-connection";

export async function startSongConsumer(prisma: PrismaClient): Promise<void> {
    try {
        const channel = await rabbitMQConnection.getChannel();

        // 1. Dengar event song.created
        await channel.assertQueue("song.created", { durable: true });
        channel.consume("song.created", async (msg) => {
            if (msg !== null) {
                try {
                    const data = JSON.parse(msg.content.toString());
                    await prisma.cachedSong.upsert({
                        where: { id: data.id },
                        update: {
                            title: data.title,
                            year: data.year,
                            performer: data.performer,
                            genre: data.genre,
                            duration: data.duration ?? null,
                            albumId: data.albumId ?? null,
                        },
                        create: {
                            id: data.id,
                            title: data.title,
                            year: data.year,
                            performer: data.performer,
                            genre: data.genre,
                            duration: data.duration ?? null,
                            albumId: data.albumId ?? null,
                        },
                    });
                    channel.ack(msg);
                } catch (error) {
                    console.error("Error processing song.created message:", error);
                    channel.nack(msg, false, false);
                }
            }
        });

        // 2. Dengar event song.updated
        await channel.assertQueue("song.updated", { durable: true });
        channel.consume("song.updated", async (msg) => {
            if (msg !== null) {
                try {
                    const data = JSON.parse(msg.content.toString());
                    await prisma.cachedSong.upsert({
                        where: { id: data.id },
                        update: {
                            title: data.title,
                            year: data.year,
                            performer: data.performer,
                            genre: data.genre,
                            duration: data.duration ?? null,
                            albumId: data.albumId ?? null,
                        },
                        create: {
                            id: data.id,
                            title: data.title,
                            year: data.year,
                            performer: data.performer,
                            genre: data.genre,
                            duration: data.duration ?? null,
                            albumId: data.albumId ?? null,
                        },
                    });
                    channel.ack(msg);
                } catch (error) {
                    console.error("Error processing song.updated message:", error);
                    channel.nack(msg, false, false);
                }
            }
        });

        // 3. Dengar event song.deleted
        await channel.assertQueue("song.deleted", { durable: true });
        channel.consume("song.deleted", async (msg) => {
            if (msg !== null) {
                try {
                    const data = JSON.parse(msg.content.toString());
                    await prisma.cachedSong.deleteMany({
                        where: { id: data.id },
                    });
                    channel.ack(msg);
                } catch (error) {
                    console.error("Error processing song.deleted message:", error);
                    channel.nack(msg, false, false);
                }
            }
        });

        console.log("✔ RabbitMQ CQRS Song Consumer started successfully");
    } catch (error) {
        console.error("Failed to start RabbitMQ CQRS Song Consumer:", error);
    }
}
