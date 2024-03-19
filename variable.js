class Variable
{
    constructor(name, currentValue, min, max, step)
    {
        this.name = name;
        this.currentValue = currentValue;

        if (min === undefined)
        {
            this.constant = true;
        }
        else
        {
            this.constant = false;
            this.min = min;
            this.max = max;
            this.step = step;
        }
    }
}