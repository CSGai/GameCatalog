class EventEmitter {
    private events: { [key: string]: Function[] } = {};

    on(event: string, callback: Function) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    emit(event: string, ...args: any[]) {
        const eventCallbacks = this.events[event];
        if (eventCallbacks) {
            eventCallbacks.forEach(callback => {
                callback(...args);
            });
        }
    }

    off(event: string, callback: Function) {
        if (!this.events[event]) {
            return;
        }
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
}

const eventEmitter = new EventEmitter();
export default eventEmitter;