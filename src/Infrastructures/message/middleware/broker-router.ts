// src/infrastructures/message/rabbitmq/rabbitmq-router.ts
export class BrokerRouter {
    private _handlers = new Map<string, (data: any) => Promise<void>>();
    on(event: string, handler: (data: any) => Promise<void>) {
        this._handlers.set(event, handler);
    }
    async dispatch(event: string, data: any) {
        const handler = this._handlers.get(event);
        if (handler) await handler(data);
    }
}