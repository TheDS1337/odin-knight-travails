import Coordinate from "./coordinate.js";

class Node 
{
    constructor(coord)
    {
        this.coord = coord;
        this.edges = [];
    }
}

const knightDisplacements = [
    new Coordinate(1, 2),
    new Coordinate(1, -2),
    new Coordinate(2, 1),
    new Coordinate(2, -1),
    new Coordinate(-1, 2),
    new Coordinate(-1, -2),
    new Coordinate(-2, 1),
    new Coordinate(-2, -1)
];

function getAllPossibleMovesFromPoint(point)
{
    let possibleMoves = [];

    knightDisplacements.forEach(disp => {
        let pos = point.shift(disp);

        if( pos.isInGrid() )
            possibleMoves.push(pos);
    });

    return possibleMoves;
}

function levelOrderForEach(node, callback)
{
    if( !callback )
        throw new Error("No callback was provided");

    let queue = [node];
    let visitedNodes = [node];

    while( queue.length > 0 ) {
        node = queue.shift();

        callback(node);
        visitedNodes.push(node);

        for( let edge of node.edges ) {
            if( visitedNodes.filter(visited => visited == edge).length == 0 )
                queue.push(edge);
        }
    }        
}

function knightMoves(start, end)
{
    // Build graph
    const startCoord = new Coordinate(...start);
    const endCoord = new Coordinate(...end);

    const root = new Node(startCoord);
    let boardNodes = [root];

    let q = [root];

    while( q.length > 0 ) {
        const curr = q.shift();
        const possibleMoves = getAllPossibleMovesFromPoint(curr.coord);

        for( let move of possibleMoves ) {
            let alreadyInPath = false;

            // Make sure this node isn't already in the path, this avoids closed paths leading to infinit loops
            levelOrderForEach(curr, node => {
                if( node.coord.isEqualTo(move) )
                    alreadyInPath = true;
            })

            if( !alreadyInPath ) {
                let node = null;

                for( let square of boardNodes ) {
                    if( square.coord.isEqualTo(move) ) {
                        node = square;
                        break;
                    }
                }

                if( !node ) {
                    node = new Node(move);
                    boardNodes.push(node);
                }

                curr.edges.push(node);
                node.edges.push(curr);

                if( !node.coord.isEqualTo(endCoord) )
                    q.push(node);
            }
        }
    }

    // Search graph

    return boardNodes;
}

let boardNodes = knightMoves([0,0], [3,3]);
boardNodes.forEach(node => console.log(node.coord, node.edges.length));

/*
const prettyPrint = (node, prefix = '', type = 0) =>
{
    if (node === null) {
        return;
    }

    if (node.right !== null) {
        prettyPrint(node.right, `${prefix}${type == 2 ? '│   '  : type == 1 ? '    ' : ''}`, 1);
    }

    let coord = node.data;

    console.log(`${prefix}${type == 2 ? '└── ' : type == 1 ? '┌── ' : ''}(${coord.x}, ${coord.y})`);

    if (node.left !== null) {
        prettyPrint(node.left, `${prefix}${type == 2 ? '    ' : type ==  1 ? '│   ' : ''}`, 2);
    }
};

let tree = new Tree([new Coordinate(1, 0), new Coordinate(0, 0), new Coordinate(0, 1)]);
prettyPrint(tree.root);*/