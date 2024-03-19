class Equation
{
    constructor(variables, fn)
    {
        this.variables = variables;
        this.fn = fn;
    }

    calculate(x, y)
    {
        // TODO maybe there is a better way of doing this?
        let vars = [];

        for (const [_, value] of Object.entries(this.variables))
        {
            vars.push(value.currentValue);
        }

        return this.fn(x, y, ...vars);
    }
}