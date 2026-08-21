// src/applications/message/message-broker-service.ts
// Interface untuk layanan Message Broker

export interface MessageBrokerService {
    sendMessage(queue: string, eventName: string, message: string): Promise<void>;
}
