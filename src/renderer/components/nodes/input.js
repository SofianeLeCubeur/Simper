import { Node } from './node'

export class String extends Node {
    constructor(id, name, inputs = [], outputs = []){
        super(id, name || 'String Input', inputs, outputs);
        this._inputType = 'text';
        this.asInput('string', (inputs) => {
            return inputs[0];
        });
        this.addInput(0, name === undefined || name === 'String Input' ? 'S' : name, 'string');
    }
}

export class StringConstant extends Node {
    constructor(id, name, inputs = [], outputs = []){
        super(id, name || 'String Input', inputs, outputs);
        this._inputType = 'text';
        this._isConstant = true;
        this.asInput('string', (inputs) => {
            return inputs[0];
        });
        this.addInput(0, name === undefined || name === 'String Input' ? 'S' : name, 'string');
    }
}

export class Number extends Node {
    constructor(id, name, inputs = [], outputs = []){
        super(id, name || 'Number Input', inputs, outputs);
        this._inputType = 'number';
        this.asInput('number', (inputs) => {
            return inputs[0].indexOf('.') != -1 ? parseFloat(inputs[0]) : parseInt(inputs[0]);
        });
        this.addInput(0, name === undefined || name === 'Number Input' ? 'X' : name, 'number');
    }
}

export class NumberConstant extends Node {
    constructor(id, name, inputs = [], outputs = []){
        super(id, name || 'Number Input', inputs, outputs);
        this._inputType = 'number';
        this._isConstant = true;
        this.asInput('number', (inputs) => {
            return inputs[0].indexOf('.') != -1 ? parseFloat(inputs[0]) : parseInt(inputs[0]);
        });
        this.addInput(0, name === undefined || name === 'Number Input' ? 'X' : name, 'number');
    }
}

export class Boolean extends Node {
    constructor(id, name, inputs = [], outputs = []){
        super(id, name || 'Bool Input', inputs, outputs);
        this._inputType = 'checkbox';
        this.asInput('bool', (inputs) => {
            return !!inputs[0];
        });
        this.addInput(0, name === undefined ? 'B' : name, 'bool');
    }
}

export default {
    name: 'Basic Inputs',
    id: 'basic_input',
    description: 'Runtime-based parameters',
    icon: {
        type: 'svg',
        path: 'M17,7H22V17H17V19A1,1 0 0,0 18,20H20V22H17.5C16.95,22 16,21.55 16,21C16,21.55 15.05,22 14.5,22H12V20H14A1,1 0 0,0 15,19V5A1,1 0 0,0 14,4H12V2H14.5C15.05,2 16,2.45 16,3C16,2.45 16.95,2 17.5,2H20V4H18A1,1 0 0,0 17,5V7M2,7H13V9H4V15H13V17H2V7M20,15V9H17V15H20Z'
    },
    types: {},
    nodes: {},
    inputs: {
        String,
        StringConstant,
        Number,
        NumberConstant,
        Boolean
    }
}