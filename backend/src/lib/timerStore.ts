export class TimerStore {
    private static timers = new Map<string, NodeJS.Timeout>;
        private constructor() {
        }
        static setTimer(id: string, timer: NodeJS.Timeout) {
            const existingTimer = this.timers.get(id);
            if (existingTimer) {
                clearTimeout(existingTimer);
            }
            this.timers.set(id, timer);
        }
        static clearTimer(id: string) {
            const timer = this.timers.get(id);
            if (timer) {
                clearTimeout(timer);
                this.timers.delete(id);
            }
        }
}