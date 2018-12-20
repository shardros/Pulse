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
        this._heap = []; 
        this._comparitor = comparator;  //Assign the comparitor lambda function to the PriorityQueue object    
    }

    /**
     * Get the last length of the list
     */
    length() {
        return this._heap.length();
    }

    /**
     * Inserts an item into the queue according to its priority as determined
     * by the function set in the constructor
     * @param {*} items The item to be inserted into the queue can be an array
     */
    enqueue(...items) {
        for (let i = 0; i < items.length; i++) {
            this._heap.push(items[i]); //Insert the item to the bottom of the heap.
            
            //Move the added item up through the heap untill it is in the correct place
            let node = this._heap.length - 1; //Take the item which is at the bottom of the heap
                   
            
            
            while (node > top && this._greater(parent(node), node)) {
                //Runs untill a bigger node is found or the top of the heap is reached
                //We need to swap the nodes into the correct order then move up the heap to begin again.
                this._swap(node, parent(node));
                node = parent(node)
            };   
        }        
    }
    
    /**
     * Method removes the highest priority item from the heap and sifts down through the heap to maintain order
     */
    dequeue() {

        const dequeuedValue = this._heap[top];
        const bottom = this._heap.length - 1;
    
        if (bottom > top) {
          this._swap(top, bottom);
        }

        this._heap.pop();

        let node = top

        //While there are bigger nodes beneath us keep going down through the heap
        while (leftChild(node) < this._heap.length && this._greater(leftChild(node), node) 
            ||(rightChild(node) < this._heap.length && this._greater(rightChild(node), node))) {
        
            if (rightChild(node) < this._heap.length && this._greater(rightChild(node), leftChild(node))) {
                var greaterChild = rightChild(node);
            } else {
                var greaterChild = leftChild(node);
            };

            this._swap(node, greaterChild);
            node = greaterChild;
    
        }
        

        return dequeuedValue;
    }
    
    /**
     * Swaps two nodes on the heap
     * @param {Number} i index of first node
     * @param {Number} j index of second node
     */
    _swap(i, j) {
        [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
    }
    
    _greater(a,b) {
        return (this._heap[a] > this._heap[b]);
    } 
}

myPriorityQueue = new PriorityQueue();

parents = [0]
numbers = [0]

for (let i = 1; i < 20; i++) {
    parents.push(parent(i));
    numbers.push(i);
    myPriorityQueue.enqueue(Math.round(Math.random()*9));
}

console.log('NUMBERS', numbers)
console.log('PARENTS', parents)
console.log('QUEUE  ',myPriorityQueue._heap)

console.log('-- HEAP ---');
console.log(myPriorityQueue._heap.slice(0,1));
console.log(myPriorityQueue._heap.slice(1,3));
console.log(myPriorityQueue._heap.slice(3,7));
console.log(myPriorityQueue._heap.slice(7,15));

for (i = 0; i < 20; i++) {
    console.log(myPriorityQueue.dequeue());
}