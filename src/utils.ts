/**
 * Util functions
 */

/**
 * Adds brackets around a string if not already bracketed.
 * @param value input string
 */
export function bracket(value: string) {
  const len = value.length;
  if (len >= 2 && value[0] === "(" && value[len - 1] === ")") {
    return value;
  }
  return `(${value})`;
}
