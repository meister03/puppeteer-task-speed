"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delayFor = void 0;
function delayFor(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
exports.delayFor = delayFor;
