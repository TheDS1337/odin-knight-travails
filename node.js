import Coordinate from "./coordinate.js";

export default class Node 
{
    constructor(coord)
    {
        this.coord = coord;
        this.edges = [];
    }

    isMovePossible(move)
    {
        let queue = [this];
        let visitedNodes = [];

        while( queue.length > 0 ) {
            let node = queue.shift();

            if( node.coord.isEqualTo(move) )
                return false;

            visitedNodes.push(node);

            for( let edge of node.edges ) {
                if( visitedNodes.filter(visited => visited == edge).length == 0 )
                    queue.push(edge);
            }
        }
        
        return true;
    }
}