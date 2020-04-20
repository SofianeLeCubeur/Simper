import { Node } from './node'

function drawLines(ctx, canvas, color, size){
    ctx.save();
    let width = canvas.width / size;
    let height = canvas.height / size;
    let tilesXCount = canvas.width / width;
    let tilesYCount = canvas.height / height;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    for(let y = 0; y < tilesYCount; y++){
        ctx.beginPath();
        ctx.moveTo(0, y * height);
        ctx.lineTo(canvas.width, y * height);
        ctx.stroke();
    }
    for(let x = 0; x < tilesXCount; x++){
        ctx.beginPath();
        ctx.moveTo(x * width, 0);
        ctx.lineTo(x * width, canvas.height);
        ctx.stroke();
    }
    ctx.restore();
}

class X extends Node {
    
    constructor(id, name = 'X', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'Input X', 'number');
        this.setWidth(86);
        this.asInput('number', (stateInputs, stateOutputs) => {
            return -1;
        }, 'coord');
        this._inputType = 'disabled';
    }
}

class Y extends Node {
    
    constructor(id, name = 'Y', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'Input Y', 'number');
        this.setWidth(86);
        this.asInput('number', (stateInputs, stateOutputs) => {
            return -1;
        }, 'coord');
        this._inputType = 'disabled';
    }
}

class Graph extends Node {
    
    constructor(id, name = 'Graph', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'X', 'number');
        this.addInput(1, 'Y', 'number');
        this.addInput(2, 'X Min', 'number');
        this.addInput(3, 'Y Min', 'number');
        this.addInput(4, 'X Max', 'number');
        this.addInput(5, 'Y Max', 'number');
        this.addInput(6, 'Step', 'number');
        this.setWidth(200);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = {x: stateInputs[0], y: stateInputs[1], 
                xMin: stateInputs[2], yMin: stateInputs[3], xMax: stateInputs[4], yMax: stateInputs[5],
                step: stateInputs[6]};
        };
        this.setPreview((ctx, canvas) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drawLines(ctx, canvas, '#e6e6e6', 10);
            drawLines(ctx, canvas, '#a3a3a3', 2);
        });
        this._renderPoints = (ctx, canvas, points) => { // Normalized points
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drawLines(ctx, canvas, '#e6e6e6', 10);
            drawLines(ctx, canvas, '#a3a3a3', 2);
            ctx.fillStyle = '#ff5f54';
            ctx.lineWidth = 2;
            let lastPoint;
            const width = canvas.width, height = canvas.height;
            points.forEach(({ x, y }) => {
                if(!lastPoint){
                    lastPoint = {x, y};
                    return;
                }
                /*ctx.beginPath();
                ctx.moveTo(lastPoint.x * width, lastPoint.y * height);
                ctx.lineTo(x * width, y * height);
                lastPoint.x = x;
                lastPoint.y = y;
                ctx.stroke();*/
                // Previously
                ctx.beginPath();
                ctx.arc(x * width, y * height, 1, 0, Math.PI * 2, true);
                ctx.fill();
            });
        }
    }

    hasEnoughInput(){
        return true;
    }
}

export default {
    name: 'Graphics Math',
    id: 'math_plan',
    description: 'Graphical math nodes',
    icon: {
        type: 'svg',
        path: 'M1,1V5H2V19H1V23H5V22H19V23H23V19H22V5H23V1H19V2H5V1M5,4H19V5H20V19H19V20H5V19H4V5H5M6,6V14H9V18H18V9H14V6M8,8H12V12H8M14,11H16V16H11V14H14'
    },
    types: {},
    nodes: {
        X,
        Y,
        Graph
    },
};