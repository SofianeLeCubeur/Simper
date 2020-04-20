import { Node } from './node'

export class PinMode extends Node {

    constructor(id, name = 'Pin Mode', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'T', 'timeline');
        this.addOutput(0, 'T', 'timeline');
        this.addInput(1, 'Pin', 'number');
        this.addInput(2, 'Mode', 'number');
        this.setWidth(115);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = `pinMode(${stateInputs[0]},${stateInputs[1]})`;
        };
    }

}

export class DigitalRead extends Node {

    constructor(id, name = 'Digital Read', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'T', 'timeline');
        this.addOutput(0, 'T', 'timeline');

        this.addInput(1, 'Pin', 'number');
        this.addOutput(1, 'State', 'number');
        this.setWidth(124);

        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = `digitalRead(${stateInputs[0]},${stateInputs[1]})`;
        };
    }

}

export class DigitalWrite extends Node {

    constructor(id, name = 'Digital Write', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'T', 'timeline');
        this.addOutput(0, 'T', 'timeline');
        this.addInput(1, 'Pin', 'number');
        this.addInput(2, 'State', 'number');
        this.setWidth(110);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = `digitalWrite(${stateInputs[0]},${stateInputs[1]})`;
        };
    }

}

export class AnalongRead extends Node {

    constructor(id, name = 'Analong Read', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'T', 'timeline');
        this.addOutput(0, 'T', 'timeline');

        this.addInput(1, 'Pin', 'number');
        this.addOutput(1, 'PWM', 'number');
        this.setWidth(124);

        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = `analogRead(${stateInputs[0]},${stateInputs[1]})`;
        };
    }

}

export class AnalogWrite extends Node {

    constructor(id, name = 'Analog Write', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'T', 'timeline');
        this.addOutput(0, 'T', 'timeline');
        this.addInput(1, 'Pin', 'number');
        this.addInput(2, 'PWM', 'number');
        this.setWidth(114);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = `analogWrite(${stateInputs[0]},${stateInputs[1]})`;
        };
    }

}
export class Delay extends Node {

    constructor(id, name = 'Delay', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'T', 'timeline');
        this.addOutput(0, 'T', 'timeline');
        this.addInput(1, 'Millis', 'number');
        this.setWidth(110);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = `delay(${stateInputs[0]})`;
        };
    }

}

// Constants
class Output extends Node {
    
    constructor(id, name = 'Output', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'Output', 'number');
        this.setWidth(86);
        this.asInput('number', (stateInputs, stateOutputs) => {
            return 1;
        });
        this._inputType = 'disabled';
    }
}

class Input extends Node {
    
    constructor(id, name = 'Input', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'Input', 'number');
        this.setWidth(73);
        this.asInput('number', (stateInputs, stateOutputs) => {
            return 0;
        });
        this._inputType = 'disabled';
    }
}

class High extends Node {
    
    constructor(id, name = 'High', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'High', 'number');
        this.setWidth(67);
        this.asInput('number', (stateInputs, stateOutputs) => {
            return 1;
        });
        this._inputType = 'disabled';
    }
}

class Low extends Node {
    
    constructor(id, name = 'Low', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'Low', 'number');
        this.setWidth(63);
        this.asInput('number', (stateInputs, stateOutputs) => {
            return 0;
        });
        this._inputType = 'disabled';
    }
}

class Setup extends Node {
    
    constructor(id, name = 'Setup', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'Setup', 'timeline');
        this.setWidth(76);
        this.asInput('timeline', (stateInputs, stateOutputs) => {
            return '@setup{';
        });
        this._inputType = 'disabled';
    }
}

class Loop extends Node {
    
    constructor(id, name = 'Loop', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'Loop', 'timeline');
        this.setWidth(70);
        this.asInput('timeline', (stateInputs, stateOutputs) => {
            return '@loop{';
        });
        this._inputType = 'disabled';
    }
}

export default {
    name: 'Arduino',
    description: 'Arduino Basic Commands',
    icon: {
        type: 'svg',
        path: 'M19,19H5V5H19M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M13.96,12.29L11.21,15.83L9.25,13.47L6.5,17H17.5L13.96,12.29Z'
    },
    types: {
        'timeline': {
            color: '#f5d2ff',
            assertation: (e) => typeof e === 'string' && e.startsWith('@')
        }
    },
    nodes: {
        PinMode,
        Delay,

        DigitalRead,
        DigitalWrite,

        AnalongRead,
        AnalogWrite,

        Setup,
        Loop,
    },
    inputs: {
        Input,
        Output,
        High,
        Low
    }
};