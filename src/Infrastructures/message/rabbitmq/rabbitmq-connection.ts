// src/infrastructures/message/rabbitmq/rabbitmq-app.ts
import amqp, { Channel, ChannelModel } from "amqplib";
import { LoggerService } from "@/applications/logger/logger-service";
import { config } from "@/commons/config";
import { MessageBrokerConnection } from "@/applications/message/message-broker-connection";

interface RabbitMQConnectionDeps {
    logger?: LoggerService;
    prefetch?: number;
}

export class RabbitMQConnection implements MessageBrokerConnection {
    private _serverUrl: string = config.rabbitmq.server;
    private _logger?: LoggerService;
    private _prefetch: number;
    private _connection: ChannelModel | null = null;
    private _channel: Channel | null = null;

    constructor(options: RabbitMQConnectionDeps) {
        this._logger = options.logger;
        this._prefetch = options.prefetch || 10;
    }


    async connect(): Promise<void> {
        if (!this._connection) {
            this._connection = await amqp.connect(this._serverUrl);
            this._channel = await this._connection.createChannel();
            await this._channel.prefetch(this._prefetch);
            this._logger?.info("[RabbitMQApp] Terhubung ke broker RabbitMQ");
        }
    }


    // 3. Method Graceful Shutdown
    async close(): Promise<void> {
        await this._channel?.close();
        await this._connection?.close();
        this._logger?.info("[RabbitMQApp] Koneksi ditutup.");
    }

    getConnection(): ChannelModel | null {
        return this._connection;
    }

    getChannel(): Channel | null {
        return this._channel;
    }

}