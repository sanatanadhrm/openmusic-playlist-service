// src/Infrastructures/message/rabbitmq/rabbitmq-connection.ts
import amqp, { Channel, ChannelModel } from "amqplib";
import { config } from "@/commons/config";

class RabbitMQConnection {
    private _connection: ChannelModel | null = null;
    private _channel: Channel | null = null;

    async getChannel(): Promise<Channel> {
        if (this._channel) {
            return this._channel;
        }

        this._connection = await amqp.connect(config.rabbitmq.server as string);
        this._channel = await this._connection.createChannel();

        return this._channel;
    }

    async close(): Promise<void> {
        await this._channel?.close();
        await this._connection?.close();
        this._channel = null;
        this._connection = null;
    }
}

// Dibuat SEKALI saat module ini pertama kali di-import — persis pola `postgresql`
export const rabbitMQConnection = new RabbitMQConnection();