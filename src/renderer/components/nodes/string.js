import { Node } from './node'

class Parse extends Node {
    constructor(id, name = 'Parse', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'Str', 'string');
        this.addOutput(0, 'Out', 'number');
        this.setWidth(110);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = stateInputs[0].indexOf('.') != -1 ? parseFloat(stateInputs[0]) : parseInt(stateInputs[0]);
        };
    }
}

class Substring extends Node {
    constructor(id, name = 'Substring', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'Str', 'string');
        this.addInput(1, 'Start', 'number');
        this.addInput(2, 'End', 'number');
        this.addOutput(0, 'Out', 'string');
        this.setWidth(135);
        this._generator = function(stateInputs, stateOutputs){
            let start = parseInt(stateInputs[1]);
            let end = parseInt(stateInputs[2]);
            stateOutputs[0] = stateInputs[0].substring(start, end);
        };
    }
}

class IndexOf extends Node {
    constructor(id, name = 'Index Of', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'Str', 'string');
        this.addInput(1, 'Needle', 'string');
        this.addOutput(0, 'Out', 'number');
        this.setWidth(140);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = stateInputs[0].indexOf(stateInputs[1]);
        };
    }
}

class Length extends Node {
    constructor(id, name = 'Length', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'Str', 'string');
        this.addOutput(0, 'Out', 'number');
        this.setWidth(110);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = stateInputs[0].length;
        };
    }
}

export default {
    name: 'String',
    id: 'string',
    description: 'String manipulation functions',
    icon: {
        type: 'svg',
        path: 'M9.62,12L12,5.67L14.37,12M11,3L5.5,17H7.75L8.87,14H15.12L16.25,17H18.5L13,3H11Z'
    },
    types: {},
    nodes: {
        Parse,
        Substring,
        IndexOf,
        Length
    }
};