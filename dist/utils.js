"use strict";
/**
 * Util functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Adds brackets around a string if not already bracketed.
 * @param value input string
 */
function bracket(value) {
    const len = value.length;
    if (len >= 2 && value[0] === "(" && value[len - 1] === ")") {
        return value;
    }
    return `(${value})`;
}
exports.bracket = bracket;
//# sourceMappingURL=utils.js.map