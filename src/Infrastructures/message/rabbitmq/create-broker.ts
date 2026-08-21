// src/infrastructures/message/rabbitmq/create-broker.ts
import { Container } from "instances-container";
import { WinstonLoggerService } from "@/Infrastructures/logger/winston/winston-service";
import { RabbitMQConnection } from "./rabbitmq-connection";
import { RabbitMQListener } from "./rabbitmq-listener";

export const createBroker = async (container: Container) => {
    const logger = container.getInstance(WinstonLoggerService.name)

    try {

        const brokerConn = container.getInstance(RabbitMQConnection.name) as RabbitMQConnection;
        // 2. CONNECT DULU! Agar channel tercipta
        await brokerConn.connect();
        logger.info("RabbitMQ: Terhubung ke broker dan channel siap digunakan");
        // 3. Buat Service (Publisher) & Daftarkan ke Container agar bisa dipakai UseCase
        // 4. Buat Listener (Consumer) & Setup Antrean
        const brokerListener = container.getInstance(RabbitMQListener.name) as RabbitMQListener;



        // (OPSIONAL) Jangan lupa tambahkan antrean yang ingin didengar:
        // brokerListener.useQueue(userQueue(container));

        await brokerListener.startConsumers();
        // 5. Graceful Shutdown
        const handleShutdown = async () => {
            logger.info("RabbitMQ: Menutup channel dan koneksi...");
            await brokerConn.close();
        };
        process.on("SIGINT", handleShutdown);
        process.on("SIGTERM", handleShutdown);
        return brokerListener;
    } catch (error) {
        logger.error("RabbitMQ: Gagal menginisialisasi broker:", error);
        throw error;
    }
};