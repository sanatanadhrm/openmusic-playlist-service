// src/applications/message/message-broker-connection.ts
// Interface untuk layanan Message Broker

export interface MessageBrokerConnection {
    connect(): Promise<void>;
    close(): Promise<void>;
    getConnection(): any;
    getChannel(): any;
}
