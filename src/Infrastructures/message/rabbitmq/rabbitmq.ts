import { Channel } from "amqplib";
import logger from "@/Infrastructures/logger/winston/winston-config";
import { BrokerRouter } from "../middleware/broker-router";

export class RabbitMQApp {
    private _channel: Channel;
    private _queues: Array<{ queueName: string; router: BrokerRouter }> = [];

    constructor(channel: Channel) {
        this._channel = channel;
    }

    use(queueName: string, router: BrokerRouter): this {
        this._queues.push({ queueName, router });
        return this;
    }

    async start(): Promise<void> {
        try {
            for (const { queueName, router } of this._queues) {
                await this._channel.assertQueue(queueName, { durable: true });

                this._channel.consume(queueName, async (msg) => {
                    if (!msg) return;

                    try {
                        const data = JSON.parse(msg.content.toString());
                        logger.info(`[RabbitMQApp] Event received on queue '${queueName}'`);

                        // Dispatch using queueName as the event name
                        await router.dispatch(queueName, data);

                        this._channel.ack(msg);
                    } catch (err) {
                        logger.error(`[RabbitMQApp] Error processing message on queue '${queueName}':`, err);
                        this._channel.nack(msg, false, false);
                    }
                });

                logger.info(`[RabbitMQApp] Listening on queue: '${queueName}'`);
            }
        } catch (error) {
            logger.error("[RabbitMQApp] Failed to start consumer:", error);
            throw error;
        }
    }

    async stop(): Promise<void> {
        await this._channel.close();
        logger.info("[RabbitMQApp] Channel closed.");
    }
}
