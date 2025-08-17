import Coordinate from "./coordinate.js";

class Node 
{
    constructor(data)
    {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

export default class Tree
{
    constructor(array)
    {
        console.log(array);

        let array_sorted = array.sort((a, b) => a.distanceFromOrigin() - b.distanceFromOrigin());
        console.log(array_sorted);
        
        this.root = Tree.#buildTree(array_sorted);
    }

    insert(value)
    {
        let node = this.root
        
        while( node  )
        {
            const left = node.left;
            const right = node.right;

            if( node.data.distanceFromOrigin() >= value.distanceFromOrigin() ) {
                if( left )
                    node = left;
                else {
                    node.left = new Node(value);
                    break;
                }
            } else {
                if( right )
                    node = right;
                else {
                    node.right = new Node(value);
                    break;
                }
            }
        }
    }

    deleteItem(value)
    {
        let {node, parent} = this.#findInOrder(value);

        const left = node.left;
        const right = node.right;

        let child = left ?? right ?? null;

        if( left && right ) {
            const {node: successorNode, parent: successorParent} = Tree.#findInOrderSuccessor(node);

            if( successorParent.left == successorNode )
                successorParent.left = null;
            else if( successorParent.right == successorNode )
                successorParent.right = null;

            successorNode.left = node.left;
            successorNode.right = node.right;

            child = successorNode;        
        }

        if( !parent )
            this.root = child;
        else if( parent.left == node )
            parent.left = child;
        else if( parent.right == node )
            parent.right = child;
    }

    find(value)
    {
        let {node} = this.#findInOrder(value);
        return node; 
    }

    levelOrderForEach(callback, node = this.root)
    {
        if( !callback )
            throw new Error("No callback was provided");

        let queue = [node];

        while( queue.length > 0 ) {
            node = queue.shift();

            if( !node )
                continue;

            callback(node);

            queue.push(node.left);
            queue.push(node.right);
        }        
    }

    inOrderForEach(callback, node = this.root)
    {
        if( !callback )
            throw new Error("No callback was provided");

        if( !node )
            return;

        this.inOrderForEach(callback, node.left);
        callback(node);
        this.inOrderForEach(callback, node.right);
    }

    preOrderForEach(callback, node = this.root)
    {
        if( !callback )
            throw new Error("No callback was provided");

        if( !node )
            return;

        callback(node);
        this.preOrderForEach(callback, node.left);
        this.preOrderForEach(callback, node.right);
    }

    postOrderForEach(callback, node = this.root)
    {
        if( !callback )
            throw new Error("No callback was provided");

        if( !node )
            return;

        this.postOrderForEach(callback, node.left);
        this.postOrderForEach(callback, node.right);
        callback(node);
    }

    height(value)
    {
        return Tree.#longestPathToLeafNode(this.find(value));
    }

    depth(value)
    {
        let {node} = this.#findInOrder(value);

        if( !node )
            return 0;
     
        let next = this.#findInOrder(value, node.right);

        while( next && next.node ) {
            node = next.node;
            next = this.#findInOrder(value, node.right);
        }

        return Tree.#longestPathBetweenNodes(this.root, node);
    }

    isBalanced(node = this.root)
    {
        let balanced = true;

        if( node ) {
            this.levelOrderForEach((child) => {
                if( !balanced )
                    return;

                const left = child.left;
                const right = child.right;

                if( Math.abs(Tree.#longestPathToLeafNode(left) - Tree.#longestPathToLeafNode(right)) > 1 ) {
                    balanced = false;
                    return;
                }

                balanced = this.isBalanced(left) && this.isBalanced(right);
            }, node);
        }

        return balanced;
    }

    rebalance()
    {
        this.root = Tree.#buildTree(this.#buildArray());
    }

    #findInOrder(value, node = this.root, parent = null)
    {
        if( !node )
            return null;

        let leftNode = this.#findInOrder(value, node.left, node);
        if( leftNode && leftNode.node.data.isEqualTo(value) )
            return leftNode;
        
        if( node.data.isEqualTo(value) )
            return {node, parent};

        let rightNode = this.#findInOrder(value, node.right, node);
        if( rightNode && rightNode.node.data.isEqualTo(value) )
            return rightNode;
    }

    static #buildTree(array)
    {
        const len = array.length;

        if( len < 1 )
            return null;

        const mid = Math.floor((len - 1) / 2);
        let root = new Node(array[mid]);
        
        root.left = Tree.#buildTree(array.slice(0, mid));
        root.right = Tree.#buildTree(array.slice(mid + 1));

        return root;
    }

    #buildArray(node = this.root, array = [])
    {
        if( !node )
            return [];

        array.concat(this.#buildArray(node.left, array));
        array.push(node.data);
        array.concat(this.#buildArray(node.right, array));

        return array;
    }

    static #findInOrderSuccessor(node) 
    {
        let parent = node;
        node = node.right;

        while( node.left ) {
            parent = node;
            node = node.left;
        }

        return {node, parent};
    }

    static #longestPathToLeafNode(node)
    {
        if( !node )
            return -1;

        return 1 + Math.max(Tree.#longestPathToLeafNode(node.left), Tree.#longestPathToLeafNode(node.right));
    }

    static #longestPathBetweenNodes(node, child, distance = 0)
    {
        if( !node || !child || node == child )
            return distance;

        if( node.data.distanceFromOrigin() > child.data.distanceFromOrigin() )
            return Tree.#longestPathBetweenNodes(node.left, child, ++distance);
        else
            return Tree.#longestPathBetweenNodes(node.right, child, ++distance);
    }
}