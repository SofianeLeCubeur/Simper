import { Node } from './node'

export class ImageSampler extends Node {

    constructor(id, name = 'Image Sampler', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'Path', 'string');
        this.addInput(1, 'X', 'number');
        this.addInput(2, 'Y', 'number');

        this.addOutput(0, 'RGBA', 'vector4');
        this.addOutput(1, 'X', 'number');
        this.addOutput(2, 'Y', 'number');
        this.addOutput(3, 'Width', 'number');
        this.addOutput(4, 'Height', 'number');

        this.setWidth(150);
        this.setPreview((ctx, canvas) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'red';
            ctx.fillRect(0, 0, 50, 50);
        });
        this._generator = function(stateInputs, stateOutputs){
            //stateOutputs[0] = stateInputs[0].indexOf('.') != -1 ? parseFloat(stateInputs[0]) : parseInt(stateInputs[0]);
        };
    }

}

export default {
    name: 'Images',
    description: 'Image decoder',
    icon: {
        type: 'svg',
        path: 'M19,19H5V5H19M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M13.96,12.29L11.21,15.83L9.25,13.47L6.5,17H17.5L13.96,12.29Z'
    },
    types: {},
    nodes: {
        ImageSampler
    },
    inputs: {}
};