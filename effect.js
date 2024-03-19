class Effect
{
    constructor(enabled, targetFunc)
    {
        this.enabled = enabled;
        this.targetFunc = targetFunc;
    }

    calculate(s64, sharpness, lineSize)
    {
        const targetFunc = [];

        const limitY = height * 2;
        const limitX = width * 2;

        for(let y = 0; y < limitY; y++)
        {
            for (let x = 0; x < limitX; x++)
            {
                const a = s64 + sharpness * (sin(hypot(height - y, width - x) / lineSize));
                targetFunc.push(a);
            }
        }

        return targetFunc;
    }

    createSliders()
    {
        let sliderLineSize;
        let sliderSharpness;
        let slider64;


        slider64 = createSlider(1, 128, 64, 1);
        slider64.position(10, height + 10);
        slider64.size(100);
        // slider64.changed(()=>
        // {
        //     calculateCircles(slider64.value(), sliderSharpness.value(), sliderLineSize.value());
        //     represent();
        // });
        slider64.parent(createDiv('Slider64'));
    
        sliderSharpness = createSlider(1, 120, 63, 1);
        sliderSharpness.position(10, height + 20);
        sliderSharpness.size(100);
        sliderSharpness.parent(createDiv('Sharpness'));
    
        // sliderSharpness.changed(()=>
        // {
        //     calculateCircles(slider64.value(), sliderSharpness.value(), sliderLineSize.value());
        //     represent();
        // });
    
        sliderLineSize = createSlider(1, 32, 16, 1);
        sliderLineSize.position(10, height + 30);
        sliderLineSize.size(100);
        // sliderLineSize.changed(()=>
        // {
        //     calculateCircles(slider64.value(), sliderSharpness.value(), sliderLineSize.value());
        //     represent();
        // });
        sliderLineSize.parent(createDiv('LineSize'));
    }

}