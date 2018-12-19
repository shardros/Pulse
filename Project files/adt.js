class PriorityQueue {
    /**
     * PriorityQueue class, implements a priority queue and methods
     * @param {boolean} comparator optional - allows for property selection of objects to be performed
     */
    constructor(comparator = (a, b) => a > b) {
        this._list = []; //List stored in the heap
        this._comparitor = comparator;
    }
}