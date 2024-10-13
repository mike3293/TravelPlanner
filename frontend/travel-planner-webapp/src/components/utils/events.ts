export class EventEmitter<T> {
    private readonly name: string;
    private listeners: Array<(e: CustomEvent<T>) => void> = [];


    constructor(name: string) {
        this.name = name;
    }


    subscribe(listener: (e: CustomEvent<T>) => void) {
        this.listeners.push(listener);
    }

    unsubscribe(listener: (e: CustomEvent<T>) => void) {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    publish(data?: T) {
        const event = new CustomEvent(this.name, { detail: data });

        this.listeners.forEach(listener => listener(event));
    }
}

export const mapResizeEventEmitter = new EventEmitter<null>('map-resize');