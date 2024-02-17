/**
 * Quicksort Algorithm
 * @param {*[]} L Array
 * @param {number} l Left Bound
 * @param {number} r Right Bound
 * @returns Recursive call of Function
 */
export default function quicksort(L, l, r) {
    if (r <= l) return;

    let i = l;
    let j = r;

    // Get Pivot Element
    let piv = L[Math.floor((l + r) / 2)];

    do {
        while (L[i] < piv) i++;
        while (L[j] > piv) j--;

        if (i <= j) {
            swap(L, i, j);
            i++;
            j--;
        }
    } while (i <= j);
    quicksort(L, l, j);
    quicksort(L, i, r);
}

/**
 * Swaps two Entries in an Array
 * @param {*[]} L Array
 * @param {number} i i-th Element
 * @param {number} j j-th Element
 */
export function swap(L, i, j) {
    let x = L[i];
    L[i] = L[j];
    L[j] = x;
}
