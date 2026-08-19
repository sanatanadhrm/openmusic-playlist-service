import { Container } from "instances-container";
import logger from "../logger/winston/winston-config";
import { rabbitMQConnection } from "./rabbitmq/rabbitmq-connection";
import { RabbitMQApp } from "./rabbitmq/rabbitmq";
import { songQueue } from "@/interfaces/message/rabbitmq/song-queue";

export const createBroker = async (container: Container) => {
    try {
        const channel = await rabbitMQConnection.getChannel();

        const brokerApp = new RabbitMQApp(channel);

        brokerApp.use("song.created", songQueue(container));
        brokerApp.use("song.updated", songQueue(container));
        brokerApp.use("song.deleted", songQueue(container));

        await brokerApp.start();

        logger.info("RabbitMQ Consumer started successfully.");

        process.on('SIGINT', async () => {
            logger.info("Stopping RabbitMQ Consumers...");
            await brokerApp.stop();
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
            logger.info("Stopping RabbitMQ Consumers...");
            await brokerApp.stop();
            process.exit(0);
        });

        return brokerApp;
    } catch (error) {
        logger.error("Failed to start RabbitMQ consumers:", error);
        throw error;
    }
};
