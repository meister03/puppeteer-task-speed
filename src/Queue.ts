import { performance } from 'node:perf_hooks';
import { delayFor } from './Util/Util';

export interface QueueItem {
    /** The function to execute */
    run(...args: any): Promise<any>;
    /** The arguments to pass to the function */
    args: any[];
    /** The timestamp the task was pushed */
    time?: number;
    /** The time to wait until executing the next task */
    timeout: number;
    /** The Description of the task */
    label: string;
}

export interface QueueOptions {
    /** Whether the spawn queue is managed automatically */
    auto: boolean;
    /** Time to wait until next item */
    timeout?: number;
    /** Custom Function for the logger */
    log(type: LogType, item: QueueItem | null, time: {start: number, end: number, diff: number}): any;
}

export enum LogType {
    'taskExec',
    'QueueEmpty'
}

export class Queue {
    queue: QueueItem[];
    options: Required<QueueOptions>;
    paused: boolean;
    log: (type: LogType, item: QueueItem | null, time: { start: number; end: number; diff: number; }) => any;
    constructor(options: Required<QueueOptions>) {
        this.options = options;
        this.queue = [];
        this.paused = false;
        this.log = options.log;
    }

    /**
     * Starts the queue and run's the item functions
     */
    public async start() {
        const startTime = performance.now();
        if (!this.options.auto) {
            return new Promise(resolve => {
                const interval = setInterval(() => {
                    if (this.queue.length === 0) {
                        clearInterval(interval);
                        const endTime = performance.now();
                        this.log(LogType.QueueEmpty, null, {start: startTime, end: endTime, diff: endTime - startTime});
                        resolve({start: startTime, end: endTime, diff: endTime - startTime });
                    }
                }, 200);
            });
        }

        const length = this.queue.length;
        for (let i = 0; i < length; i++) {
            if (!this.queue[0]) continue;
            const timeout = this.queue[0].timeout;
            await this.next();
            await delayFor(timeout);
        }
        const endTime = performance.now();
        this.log(LogType.QueueEmpty, null, {start: startTime, end: endTime, diff: endTime - startTime});
        return {start: startTime, end: endTime, diff: endTime - startTime };
    }

    /**
     * Goes to the next item in the queue
     */
    public async next() {
        if (this.paused) return;
        const item = this.queue.shift();
        if (!item) return true;
        const startTime = performance.now();
        const res = await item.run(...item.args);
        const endTime = performance.now();
        this.log(LogType.taskExec, item, {start: startTime, end: endTime, diff: endTime - startTime});
        return res;
    }

    /**
     * Stop's the queue and blocks the next item from running
     */
    public stop() {
        this.paused = true;
        return this;
    }

    /**
     * Resume's the queue
     */
    public resume() {
        this.paused = false;
        return this;
    }

    /**
     * Adds an item to the queue
     */
    public add(item: QueueItem) {
        this.queue.push({
            run: item.run,
            args: item.args,
            time: performance.now(),
            timeout: item.timeout ?? this.options.timeout,
            label: item.label
        });
        return this;
    }
}