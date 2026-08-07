// src/Infrastructures/message/rabbitmq/rabbitmq-service.ts
// Implementasi konkret MessageBrokerService menggunakan amqplib (RabbitMQ)

import amqp from "amqplib";
import { MessageBrokerService } from "@/applications/message/message-broker-service";
import { rabbitMQConnection } from "./rabbitmq-connection";

export class RabbitMQService implements MessageBrokerService {
    constructor(private connection = rabbitMQConnection) { }

    async sendMessage(queue: string, message: string): Promise<void> {
        const channel = await this.connection.getChannel();

        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(message));
    }
}
