export default class Coordinate
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }

    isEqualTo(point)
    {
        return this.x == point.x && this.y == point.y;
    }

    isInGrid()
    {
        return this.x < 8 && this.x >= 0 && this.y < 8 && this.y >= 0;
    }

    shift(point)
    {
        return new Coordinate(this.x + point.x, this.y + point.y);
    }
}