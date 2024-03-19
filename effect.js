class Effect
{
    constructor(name, equation, height, width)
    {
        this.name = name;

        this.equation = equation;
        this.buffer = [];
        this.height = height;
        this.width = width;
        this.disable();
    }

    enable()
    {
        this.enabled = true;
    }

    disable()
    {
        this.enabled = false;
    }

    calculateBuffer()
    {
        const buffer = [];

        for(let y = 0; y < this.height; y++)
        {
            for (let x = 0; x < this.width; x++)
            {
                const a = this.equation.calculate(x, y);
                buffer.push(a);
            }
        }

        this.buffer = buffer;
    }

    moveInBuffer(time)
    {
        // setup some nice colours, different every frame
        // this is a palette that wraps around itself, with different period sine
        // functions to prevent monotonous colours
        // buildPalette();

        // move plasma with more sine functions :)
        //(height / 2) * (width * 2) + (width / 2)
        let Windowx1 = (width / 2) + Math.floor((((width / 2)-1) * cos(time / 970)));
        let Windowy1 = (height / 2) + Math.floor((((height / 2) - 1) * sin(time / 1230)));

        // we only select the part of the precalculated buffer that we need
        return Windowy1 * (width * 2) + Windowx1;
    }

    addSliders(x, y, distance, size)
    {
        this.sliders = {};

        for (const [_, variable] of Object.entries(this.equation.variables))
        {
            if (!variable.constant)
            {
                y += distance;
                this.sliders[variable.name] = this.addSlider(variable, x, y, size);
            }
        }
    }

    addSlider(variable, x, y, size)
    {
        const slider = createSlider(variable.min, variable.max, variable.currentValue, variable.step);

        slider.position(x, y);
        slider.size(size);

        const div = createDiv(variable.name);
        div.position(size + x + 10, y);

        slider.changed(()=>
        {
            variable.currentValue = slider.value();
            console.log("Variable %s changed to value %s", variable.name, variable.currentValue);
            this.calculateBuffer();
        });

        return slider;
    }

    addVariable(variable)
    {

    }

    deleteVariable(name)
    {
        // TODO Remove from view.
        // Do we need to recalculate everything?
        delete this.sliders[name];
    }

}