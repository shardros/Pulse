/**Top - All nodes which aren't leaf nodes are top nodes to smaller heaps. 
 * This value alows us to define a node as the "top node"
 * 
 * Parent - Gets index of parent node in the heap list
 * LeftChild - Gets the index of the left child node in the heap list
 * RightChild - Gets the index of the right child node in the heap list
 */
top = 0; 
parent = x => ((x + 1) >>> 1) - 1;  //Need to use >>> to discard the bits lost
leftChild = x => (x << 1) + 1;
rightChild = x => (x + 1) << 1;

class PriorityQueue {
    /**
     * PriorityQueue class, implements a priority queue and methods
     * This implementation uses a heap
     * @param {*} comparator optional - allows for property selection of objects to be performed
     */
    constructor(comparator = (a, b) => a > b) {
        this._heap = []; //List stored in the heap
        this._comparitor = comparator;  //Assign the comparitor lambda function to the PriorityQueue object
         
    }

    /**
     * Get the last length of the list
     */
    length() {
        return this._heap.length();
    }

    /**
     * Return the item at the 
     */
    peek() {
        return this._heap[0]
    }

    /**
     * Inserts an item into the queue according to its priority as determined by the function set in the constructor
     * @param {*} items The item to be inserted into the queue can be an array
     */
    enqueue(...items) {
        for (let i = 0; i < items.length; i++) {
            this._heap.push(items[i]); //Insert the item to the bottom of the heap.
            //move the added item up through the heap untill it is in the correct place
            let node = this._heap.length - 1; //Take the item which is at the bottom of the heap
                   
            //Runs untill a bigger node is found or the top of the heap is reached
            while (node > top && this._heap[node] < this._heap[parent(node)]) {
                //We need to swap the nodes into the correct order then move up the heap to begin again.
                this._swap(node, parent(node));
                node = parent(node)
           };   
        }        
    }

    /**
     * Swaps two nodes on the heap
     * @param {Number} i index of first node
     * @param {Number} j index of second node
     */
    _swap(i, j) {
        [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
    }
}

myPriorityQueue = new PriorityQueue();

for (let i = 0; i < 20; i++) {
    myPriorityQueue.enqueue(Math.round(Math.random()*10));
}

console.log(myPriorityQueue._heap)