import Coordinate from "./coordinate.js";
import Node from "./node.js"

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
    const startCoord = new Coordinate(...start);
    const endCoord = new Coordinate(...end);

    const root = new Node(startCoord);
    let boardNodes = [root];

    let q = [root];
    let foundEnd = false;
    let edges = [];

    while( q.length > 0 && !foundEnd ) {
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

                if( node.coord.isEqualTo(endCoord) ) {
                    foundEnd = true;
                    edges = node.edges;
                    break;
                }
                else
                    q.push(node);
            }
        }
    }

    // Found shortest path, now remove all nodes who are not directly connected to end node
    for( let i = boardNodes.length - 2; i >= 0; i-- ) {
        if( edges.length == 0 )
            break;

        const node = boardNodes[i];

        if( edges.includes(node) )
            edges = node.edges;
        else
            boardNodes.splice(i, 1);
    }

    return Array.from(boardNodes, node => [node.coord.x, node.coord.y]);
}


console.log("From (0, 0) to (3, 3): ", knightMoves([0, 0], [3, 3]));
console.log("From (3, 3) to (0, 0): ", knightMoves([3, 3], [0, 0]));
console.log("From (0, 0) to (7, 7): ", knightMoves([0, 0], [7, 7]));