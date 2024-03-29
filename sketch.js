
let targets = [];
let sources = [];

let effects = {};

function setup()
{
    createCanvas(640, 480);

    // slider64 = createSlider(1, 128, 64, 1);

    const circleVariables = {};
    circleVariables['height'] = new Variable('height', height);
    circleVariables['width'] = new Variable('width', width);
    circleVariables['diffusion'] = new Variable('diffusion', 64, 1, 128, 1);
    circleVariables['sharpness'] = new Variable('sharpness', 63, 1, 120, 1);
    circleVariables['zoom'] = new Variable('zoom', 2, 2, 32, 1);

    // TODO improve this creation, too manual!
    //diffusion + sharpness * (sin(hypot(height - y, width - x) / zoom))
    const circleFn = Function('x', 'y', 'height', 'width', 'diffusion', 'sharpness', 'zoom',
                              'return diffusion + sharpness * (sin(hypot(height - y, width - x) / zoom))');

    const circleEq = new Equation(circleVariables, circleFn);
    const circles = new Effect('Circles', circleEq, height * 2, width * 2);

    circles.enable();
    circles.calculateBuffer();
    circles.addSliders(10, height, 30, 100);

    effects[circles.name] = circles;

    targets.push(circles.buffer);

    const wave = calculateWave();
    targets.push(wave);

    let src1 = calculateSrc1();
    let src2 = calculateSrc2();
    sources.push(src1);
    sources.push(src2);

    represent(targets, sources);
}

let lastTime = 0, currentTime = 0;

function draw()
{
    // frameRate(30);
    targets = [];
    targets.push(effects['Circles'].buffer);

    // const wave = calculateWave();
    // targets.push(wave);

    currentTime = new Date().getTime();

    sources = [];
    sources.push(calculateSrc1(currentTime), calculateSrc2(currentTime));

    represent(targets, sources);

    fps();
}

function fps()
{
    const fps = frameRate();
    fill(255);
    stroke(0);
    text("FPS: " + fps.toFixed(2), 10, height - 10);
}

function calculateWave()
{
    const targetFunc = [];

    const limitY = height * 2;
    const limitX = width * 2;

    for(let y = 0; y < limitY; y++)
    {
        for (let x = 0; x < limitX; x++)
        {
            const a = (64 + 63 * sin(x / (37 + 15 * cos(y / 74)))
                       * cos(y / (31 + 11 * sin(x / 57))));
            targetFunc.push(a);
        }
    }

    return targetFunc;
}

function calculateCircles(s64, sharpness, lineSize)
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

function calculateSrc1(time)
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

function calculateSrc2(time)
{
	// setup some nice colours, different every frame
	// this is a palette that wraps around itself, with different period sine
	// functions to prevent monotonous colours
	// buildPalette();

	// move plasma with more sine functions :)
	let Windowx2 = (width / 2) + Math.floor((((width / 2) - 1) * sin(-time / 1140)));
	let Windowy2 = (height / 2) + Math.floor((((height / 2) - 1) * cos(-time / 750)));
	// we only select the part of the precalculated buffer that we need
	return Windowy2 * (width * 2) + Windowx2;
}

function represent(targets, sources)
{
    loadPixels();
    let d = pixelDensity();
    const colors = 4;
    const widthMax = width * d * colors;
    const heightMax = height * d;
    let src1 = sources[0];
    let src2 = sources[1];

    for(let y = 0; y < heightMax; y++)
    {
        for (let x = 0; x < widthMax; x += colors)
        {
            let index = x + y * widthMax;
            let sum = 0;

            sum += targets[0][src1];
            // sum += targets[1][src2];

            // for (let target = 0; target < targets.length; target++)
            // {
            //     sum += targets[target][sources[target]];
            // }

            const color = sum % 256;

            // Red.
            pixels[index] = color;
            // Green.
            pixels[index + 1] = color;
            // Blue.
            pixels[index + 2] = color;
            // Alpha.
            pixels[index + 3] = 255;

            src1++;
            src2++;
        }

        src1 += width;
        src2 += width;
    }

    updatePixels();
}
