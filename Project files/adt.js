class PriorityQueue {
    /**
     * PriorityQueue class, implements a priority queue and methods
     * @param {boolean} comparator optional - allows for property selection of objects to be performed
     */
    constructor(comparator = (a, b) => a > b) {
        this._list = []; //List stored in the heap
        this._comparitor = comparator;
    }

    /**
     * Get the last length of the list
     */
    length() {
        this._list.length();
    }

    /**
     * Return the item at the 
     */
    peek() {
        return this._list[0]
    }

    /**
     *  Removes and returns the first item from the queue      
     */
    shift() {
        return this.shift();
    }

    /**
     * Inserts an item into the queue according to its priority as determined by the function set in the constructor
     * @param {*} item The item to be inserted into the list
     */
    push(item) {

    }

}