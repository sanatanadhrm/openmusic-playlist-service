// src/infrastructures/message/rabbitmq/rabbitmq-app.ts
import { LoggerService } from "@/applications/logger/logger-service";
import { MessageBrokerService } from "@/applications/message/message-broker-service";
import { RabbitMQConnection } from "./rabbitmq-connection";

interface RabbitMQServiceDeps {
    logger?: LoggerService;
    connection: RabbitMQConnection;

}

// Implementasikan interface MessageBrokerService agar bisa di-inject ke UseCase
export class RabbitMQService implements MessageBrokerService {
    private _logger?: LoggerService;
    private _connection: RabbitMQConnection;

    constructor(options: RabbitMQServiceDeps) {
        this._logger = options.logger;
        this._connection = options.connection
    }


    async sendMessage(queueName: string, eventName: string, data: any): Promise<void> {
        const channel = this._connection.getChannel();
        if (!channel) throw new Error("Koneksi RabbitMQ belum terbuka!");

        try {
            await channel.assertQueue(queueName, { durable: true });
            const payload = JSON.stringify({ event: eventName, data: data });

            channel.sendToQueue(queueName, Buffer.from(payload));
            this._logger?.info(`[RabbitMQApp] Mengirim event '${eventName}' ke '${queueName}'`);
        } catch (error) {
            this._logger?.error(`[RabbitMQApp] Gagal mengirim pesan:`, error);
            throw error;
        }
    }


}