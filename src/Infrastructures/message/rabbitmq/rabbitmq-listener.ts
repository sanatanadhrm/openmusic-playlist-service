// src/infrastructures/message/rabbitmq/rabbitmq-app.ts
import { LoggerService } from "@/applications/logger/logger-service";
import { BrokerRouter } from "../middleware/broker-router";
import { RabbitMQConnection } from "./rabbitmq-connection";
import { MessageBrokerListener } from "@/applications/message/message-broker-listener";

interface RabbitMQListenerDeps {
    connection: RabbitMQConnection;
    logger?: LoggerService;
}

// Implementasikan interface MessageBrokerService agar bisa di-inject ke UseCase
export class RabbitMQListener implements MessageBrokerListener {
    private _logger?: LoggerService;
    private _connection: RabbitMQConnection;
    private _queues: Array<{ queueName: string; router: BrokerRouter }> = [];

    constructor(options: RabbitMQListenerDeps) {
        this._logger = options.logger;
        this._connection = options.connection;
    }

    // --- FITUR UNTUK KEDUA PERAN ---

    /**
     * Membuka koneksi ke RabbitMQ. 
     * Cukup dipanggil 1x saat aplikasi menyala.
     */


    // --- FITUR SEBAGAI PENDENGAR (CONSUMER) ---

    useQueue(module: { queueName: string; router: BrokerRouter }): this {
        this._queues.push(module);
        return this;
    }

    /**
     * Menjalankan consumer. Jika _queues kosong, dia tidak akan melakukan apa-apa (Fleksibel!)
     */
    async startConsumers(): Promise<void> {
        const channel = this._connection.getChannel();
        if (!channel) throw new Error("Koneksi RabbitMQ belum terbuka!");

        if (this._queues.length === 0) {
            this._logger?.info("[RabbitMQApp] Tidak ada antrean yang didengarkan (Publisher Only mode).");
            return;
        }

        for (const { queueName, router } of this._queues) {
            await channel.assertQueue(queueName, { durable: true });
            channel.consume(queueName, async (msg) => {
                if (!msg) return;
                try {
                    const { event, data } = JSON.parse(msg.content.toString());
                    await router.dispatch(event, data);
                    channel.ack(msg);
                } catch (err) {
                    channel.nack(msg, false, false);
                }
            });
            this._logger?.info(`[RabbitMQApp] Mendengarkan antrean: '${queueName}'`);
        }
    }
}