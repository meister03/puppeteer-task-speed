"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = exports.LogType = void 0;
const node_perf_hooks_1 = require("node:perf_hooks");
const Util_1 = require("./Util/Util");
var LogType;
(function (LogType) {
    LogType[LogType["taskExec"] = 0] = "taskExec";
    LogType[LogType["QueueEmpty"] = 1] = "QueueEmpty";
})(LogType = exports.LogType || (exports.LogType = {}));
class Queue {
    queue;
    options;
    paused;
    log;
    constructor(options) {
        this.options = options;
        this.queue = [];
        this.paused = false;
        this.log = options.log;
    }
    /**
     * Starts the queue and run's the item functions
     */
    async start() {
        const startTime = node_perf_hooks_1.performance.now();
        if (!this.options.auto) {
            return new Promise(resolve => {
                const interval = setInterval(() => {
                    if (this.queue.length === 0) {
                        clearInterval(interval);
                        const endTime = node_perf_hooks_1.performance.now();
                        this.log(LogType.QueueEmpty, null, { start: startTime, end: endTime, diff: endTime - startTime });
                        resolve({ start: startTime, end: endTime, diff: endTime - startTime });
                    }
                }, 200);
            });
        }
        const length = this.queue.length;
        for (let i = 0; i < length; i++) {
            if (!this.queue[0])
                continue;
            const timeout = this.queue[0].timeout;
            await this.next();
            await (0, Util_1.delayFor)(timeout);
        }
        const endTime = node_perf_hooks_1.performance.now();
        this.log(LogType.QueueEmpty, null, { start: startTime, end: endTime, diff: endTime - startTime });
        return { start: startTime, end: endTime, diff: endTime - startTime };
    }
    /**
     * Goes to the next item in the queue
     */
    async next() {
        if (this.paused)
            return;
        const item = this.queue.shift();
        if (!item)
            return true;
        const startTime = node_perf_hooks_1.performance.now();
        const res = await item.run(...item.args);
        const endTime = node_perf_hooks_1.performance.now();
        this.log(LogType.taskExec, item, { start: startTime, end: endTime, diff: endTime - startTime });
        return res;
    }
    /**
     * Stop's the queue and blocks the next item from running
     */
    stop() {
        this.paused = true;
        return this;
    }
    /**
     * Resume's the queue
     */
    resume() {
        this.paused = false;
        return this;
    }
    /**
     * Adds an item to the queue
     */
    add(item) {
        this.queue.push({
            run: item.run,
            args: item.args,
            time: node_perf_hooks_1.performance.now(),
            timeout: item.timeout ?? this.options.timeout,
            label: item.label
        });
        return this;
    }
}
exports.Queue = Queue;
