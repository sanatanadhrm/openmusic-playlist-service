// src/applications/message/message-broker-service.ts
// Interface untuk layanan Message Broker

export interface MessageBrokerListener {
    startConsumers(): Promise<void>;

}
