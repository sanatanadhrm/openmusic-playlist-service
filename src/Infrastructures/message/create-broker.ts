import { Container } from "instances-container";
import logger from "../logger/winston/winston-config";
import { songQueue } from "@/interfaces/message/rabbitmq/song-queue";
import { RabbitMQConnection } from "./rabbitmq/rabbitmq-connection";
import { RabbitMQListener } from "./rabbitmq/rabbitmq-listener";
import { SONG_QUEUE } from "@/domains/song/constants/song-queue";

export const createBroker = async (container: Container) => {
    try {
        const brokerConn = container.getInstance(RabbitMQConnection.name) as RabbitMQConnection;
        await brokerConn.connect();

        const brokerListener = container.getInstance(RabbitMQListener.name) as RabbitMQListener;

        brokerListener.useQueue({
            queueName: SONG_QUEUE.BASE, // Sinkron dengan Catalog Service
            router: songQueue(container)
        })
        await brokerListener.startConsumers();


        logger.info("RabbitMQ Consumer started successfully.");

        const handleShutdown = async () => {
            logger.info("RabbitMQ: Menutup channel dan koneksi...");
            await brokerConn.close();
        };
        process.on("SIGINT", handleShutdown);
        process.on("SIGTERM", handleShutdown);
        return brokerListener;
    } catch (error) {
        logger.error("Failed to start RabbitMQ consumers:", error);
        throw error;
    }
};
