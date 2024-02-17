/**
 * Clamps number num between Minimal and Maximal
 * @param {number} num Number to clamp
 * @param {number} min Minimal Bound
 * @param {number} max Maximal Bound
 * @returns {number} Clamped number
 */
export function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}
