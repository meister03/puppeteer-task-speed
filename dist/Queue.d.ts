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
    /** Whether the spawn queue be automatically managed */
    auto: boolean;
    /** Time to wait until next item */
    timeout?: number;
    /** Custom Function for the logger */
    log(type: LogType, item: QueueItem | null, time: {
        start: number;
        end: number;
        diff: number;
    }): any;
}
export declare enum LogType {
    'taskExec' = 0,
    'QueueEmpty' = 1
}
export declare class Queue {
    queue: QueueItem[];
    options: Required<QueueOptions>;
    paused: boolean;
    log: (type: LogType, item: QueueItem | null, time: {
        start: number;
        end: number;
        diff: number;
    }) => any;
    constructor(options: Required<QueueOptions>);
    /**
     * Starts the queue and run's the item functions
     */
    start(): Promise<unknown>;
    /**
     * Goes to the next item in the queue
     */
    next(): Promise<any>;
    /**
     * Stop's the queue and blocks the next item from running
     */
    stop(): this;
    /**
     * Resume's the queue
     */
    resume(): this;
    /**
     * Adds an item to the queue
     */
    add(item: QueueItem): this;
}
//# sourceMappingURL=Queue.d.ts.map