/**
 * Interpolation Search Algorithm
 * @param {number[]} L Array to search in
 * @param {number} x Value to Search for
 * @param {number} l Left Bound
 * @param {number} r Right Bound
 * @returns
 */
function interpolationSearch(L, x, l, r) {
    if (x < L[l] || x > L[r]) return -1;

    console.log(L, x, l, r);
    const piv = Math.floor(l + ((x - L[l]) / (L[r] - L[l])) * (r - l));
    console.log("piv", piv);

    return 0;
}

/**
 * Check if Value x is Element of the Array
 * @param {number[]} L Array to search in
 * @param {number} x Value to Search for
 * @returns {boolean} true if Value x is in Array, otherwise false
 */
function includes_interpolative(L, x) {
    return interpolationSearch(L, x, 0, L.length - 1) === -1 ? false : true;
}

export default search = {
    interpolationSearch,
    includes_interpolative,
};
