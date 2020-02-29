import { Node } from './node'

class Print extends Node {
    
    constructor(id, name = 'Print', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'In', '*');
        this.setWidth(80);
        this._generator = function(stateInputs, stateOutputs){
            Object.values(stateInputs).forEach((input, i) => {
                console.log('%c[PrintNode] %c{'+ i +'}->', 'color:aqua', 'color:lightcyan', input);
            });
        };
    }
}

class Base extends Node {
    
    constructor(id, name = 'Base Switch', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'X', 'string');
        this.addInput(1, 'In Base', 'number',);
        this.addInput(2, 'Out Base', 'number');
        this.addOutput(0, 'Out', 'string');
        this.setWidth(175);
        this._generator = function(stateInputs, stateOutputs){
            let inBase = parseInt(stateInputs[1]);
            let outBase = parseInt(stateInputs[2]);
            stateOutputs[0] = parseInt(stateInputs[0], inBase).toString(outBase);
        };
    }
}

class Time extends Node {
    
    constructor(id, name = 'Time', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.setWidth(70);
        this.addInput(0, 'Time', 'number');
        this.asInput('number', (stateInputs, stateOutputs) => {
            return Date.now();
        }, 'ms');
        this._inputType = 'disabled';
    }
}

class Random extends Node {
    
    constructor(id, name = 'Random', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'Random', 'number');
        this.setWidth(96);
        this.asInput('number', (stateInputs, stateOutputs) => {
            return Math.random();
        }, 'ms');
        this._inputType = 'disabled';
    }
}

export default {
    name: 'Miscellaneous',
    id: 'misc',
    description: 'Strange and fun nodes',
    icon: {
        type: 'svg',
        path: 'M1,1V5H2V19H1V23H5V22H19V23H23V19H22V5H23V1H19V2H5V1M5,4H19V5H20V19H19V20H5V19H4V5H5M6,6V14H9V18H18V9H14V6M8,8H12V12H8M14,11H16V16H11V14H14'
    },
    types: {},
    nodes: {
        Print,
        Base,
        Time,
        Random
    },
};