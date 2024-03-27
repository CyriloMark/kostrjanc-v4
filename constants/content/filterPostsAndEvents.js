import { lerp } from "..";
import search from "../search";

/**
 * Returns the Object without the Ids from filterData
 * @param {Object} contentData Object with Posts and Events Ids as Childs
 * @param {Object} filterData Object with Posts and Events Ids as Childs to filter
 * @return {Object} Filtered Ids Object
 */
export function filterPostsAndEvents(contentData, filterData) {
    if (filterData.posts.length == 0 && filterData.events.length == 0)
        return contentData;

    if (filterData.posts.length !== 0)
        filter_handlePosts(contentData.posts, filterData.posts);
    if (filterData.events.length !== 0)
        filter_handleEvents(contentData.events, filterData.events);

    return contentData;
}

/**
 * Background: Reverse Jump-Search with linear Search inside
 * @param {number[]} posts Array of Posts Ids
 * @param {number[]} filterPosts Array of Posts Ids to filter
 */
function filter_handlePosts(posts, filterPosts) {
    // const m = Math.floor(Math.sqrt(posts.length));

    // jumpFilter(0, m, posts, filterPosts);
    o_n_2Filter(posts, filterPosts);
}

/**
 * Background: Reverse Jump-Search with linear Search inside
 * @param {number[]} events Array of Events Ids
 * @param {number[]} filterEvents Array of Events Ids to filter
 */
function filter_handleEvents(events, filterEvents) {
    // const m = Math.floor(Math.sqrt(events.length));

    // jumpFilter(0, m, events, filterEvents);
    o_n_2Filter(events, filterEvents);
}

/**
 * Recursive (reverse) Jump Search
 * @param {number} i Index of Jump-Search
 * @param {number} m Jump length
 * @param {number[]} content Array of Content Ids
 * @param {number[]} filter Array of Content Ids to filter
 * @returns
 */
function jumpFilter(i, m, content, filter) {
    let pos = content.length - 1 - i * m;
    const currentFilterElement = filter[filter.length - 1];

    if (pos < 0) pos = 0;

    console.log(content.length, filter.length);

    if (content[pos] > currentFilterElement)
        return jumpFilter(i + 1, m, content, filter);
    else if (content[pos] == currentFilterElement) {
        content.splice(pos, 1);
        filter.pop();
        return jumpFilter(i + 1, m, content, filter);
    } else if (content[pos] < currentFilterElement) {
        const prev = pos + m;

        for (let j = prev; j > pos; j--) {
            if (content[j] == currentFilterElement) {
                content.splice(j, 1);
                filter.pop();
                if (j > 0) return jumpFilter(i, m, content, filter);
            }
        }
    }
}

/**
 *
 * @param {number[]} content Array of Content Ids
 * @param {number[]} filter Array of Content Ids to filter
 */
function o_n_2Filter(content, filter) {
    for (let i = 0; i < filter.length; i++) {
        if (!content.includes(filter)) continue;

        const pos = content.indexOf(filter[i]);
        content.splice(pos, 1);
    }
}

/**
 * Sorts the Array increasingly with Selection Sort
 * @param {number[]} L Array of Ids
 */
export function sortIds_SelectionSort(L) {
    let min = 0;
    for (let i = 0; i < L.length - 1; i++) {
        min = i;
        for (let j = i + 1; j < L.length; j++)
            if (L[j].id < L[min].id) {
                min = j;

                // Swap
                let x = L[i];
                L[i] = L[min];
                L[min] = x;
            }
    }
    L.reverse();
}

/**
 * Sorts the Array increasingly with Insertion Sort
 * @param {*[]} L List of Ids
 * @param {String} key Child Key to Sort by
 * @returns {*[]} Sorted List
 */
export function sortIds_InsertionSort(L, key) {
    for (let i = 1; i < L.length; i++) {
        let current = L[i];
        let j = i - 1;

        while (j >= 0 && L[j][key] > current[key]) {
            L[j + 1] = L[j];
            j--;
        }

        L[j + 1] = current;
    }

    L.reverse();
    return L;
}

/**
 * Merges and Sorts all Elements from Second randomly into Original
 * @param {number[]} original Array to Sort in
 * @param {number[]} second Array of Ids to sort into the Original
 */
export function mergeSortRandomly(original, second) {
    second.forEach(e => {
        const rand = Math.random();
        const index = Math.round(lerp(0, original.length, rand));
        original.splice(index, 0, e);
    });
}
