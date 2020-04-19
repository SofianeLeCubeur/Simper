import { Node } from './node'

function dot(vector1, vector2) {
    return vector1.reduce((sum, element, index) => sum += element * vector2[index], 0);
}

class Add extends Node {
    
    constructor(id, name = 'Add', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'A', 'number', '#fd696b');
        this.addInput(1, 'B', 'number', '#6797ff');
        this.addOutput(0, 'Out', 'number', '#ffd686');
        this.setWidth(110);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = stateInputs[0] + stateInputs[1];
        };
    }
}

class Subtract extends Node {
    
    constructor(id, name = 'Subtract', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'A', 'number', '#fd696b');
        this.addInput(1, 'B', 'number', '#6797ff');
        this.addOutput(0, 'Out', 'number', '#ffd686');
        this.setWidth(110);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = stateInputs[0] - stateInputs[1];
        };
    }
}

class Multiply extends Node {
    
    constructor(id, name = 'Multiply', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'A', 'number', '#fd696b');
        this.addInput(1, 'B', 'number', '#6797ff');
        this.addOutput(0, 'Out', 'number', '#ffd686');
        this.setWidth(125);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = stateInputs[0] * stateInputs[1];
        };
    }
}

class Divide extends Node {
    
    constructor(id, name = 'Divide', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'X', 'number', '#fd696b');
        this.addInput(1, 'q', 'number', '#6797ff');
        this.addOutput(0, 'Q', 'number', '#ffd686');
        this.setWidth(110);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = stateInputs[0] / stateInputs[1];
        };
    }
}

class Modulo extends Node {
    
    constructor(id, name = 'Modulo', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'X', 'number', '#fd696b');
        this.addInput(1, 'q', 'number', '#6797ff');
        this.addOutput(0, 'r', 'number', '#ffd686');
        this.setWidth(110);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = stateInputs[0] % stateInputs[1];
        };
    }
}

class Power extends Node {
    
    constructor(id, name = 'Power', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'A', 'number', '#fd696b');
        this.addInput(1, 'B', 'number', '#ff86a1');
        this.addOutput(0, 'Out', 'number', '#ffd686');        
        this.setWidth(110);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = Math.pow(stateInputs[0], stateInputs[1]);
        };
    }
}

class Sine extends Node {
    
    constructor(id, name = 'Sine', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'A', 'number', '#fd696b');
        this.addOutput(0, 'Out', 'number', '#ffd686');        
        this.setWidth(110);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = Math.sin(stateInputs[0]);
        };
    }
}

class Cosine extends Node {
    
    constructor(id, name = 'Cosine', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'A', 'number', '#fd696b');
        this.addOutput(0, 'Out', 'number', '#ffd686');
        this.setWidth(110);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = Math.cos(stateInputs[0]);
        };
    }
}

class Tan extends Node {
    
    constructor(id, name = 'Tan', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'A', 'number', '#fd696b');
        this.addOutput(0, 'Out', 'number', '#ffd686');
        this.setWidth(110);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = Math.tan(stateInputs[0]);
        };
    }
}

class ArcSine extends Node {
    
    constructor(id, name = 'ArcSine', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'A', 'number', '#fd696b');
        this.addOutput(0, 'Out', 'number', '#ffd686');        
        this.setWidth(110);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = Math.asin(stateInputs[0]);
        };
    }
}

class ArcCosine extends Node {
    
    constructor(id, name = 'ArcCosine', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'A', 'number', '#fd696b');
        this.addOutput(0, 'Out', 'number', '#ffd686');
        this.setWidth(110);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = Math.acos(stateInputs[0]);
        };
    }
}

class ArcTan extends Node {
    
    constructor(id, name = 'ArcTan', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'A', 'number', '#fd696b');
        this.addOutput(0, 'Out', 'number', '#ffd686');
        this.setWidth(110);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = Math.atan(stateInputs[0]);
        };
    }
}

class DegToRad extends Node {
    
    constructor(id, name = 'Deg To Rad', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'θ', 'number', '#fd696b');
        this.addOutput(0, 'Out', 'number', '#ffd686');
        this.setWidth(120);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = stateInputs[0] * (Math.PI/180);
        };
    }
}

class RadToDeg extends Node {
    
    constructor(id, name = 'Rad To Deg', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'θ', 'number', '#fd696b');
        this.addOutput(0, 'Out', 'number', '#ffd686');
        this.setWidth(120);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = stateInputs[0] * (180/Math.PI);
        };
    }
}

class Sqrt extends Node {
    
    constructor(id, name = 'Square Root', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'A', 'number', '#fd696b');
        this.addOutput(0, 'Out', 'number', '#ffd686');
        this.setWidth(120);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = Math.sqrt(stateInputs[0]);
        };
    }
}

class Min extends Node {
    
    constructor(id, name = 'Min', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'A', 'number', '#fd696b');
        this.addInput(1, 'B', 'number', '#ff86a1');
        this.addOutput(0, 'Out', 'number', '#ffd686');
        this.setWidth(120);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = Math.min(stateInputs[0], stateInputs[1]);
        };
    }
}

class Max extends Node {
    
    constructor(id, name = 'Max', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'A', 'number', '#fd696b');
        this.addInput(1, 'B', 'number', '#ff86a1');
        this.addOutput(0, 'Out', 'number', '#ffd686');
        this.setWidth(120);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = Math.max(stateInputs[0], stateInputs[1]);
        };
    }
}

class Remap extends Node {
    
    constructor(id, name = 'Remap', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'X', 'number', '#fd696b');
        this.addInput(1, 'In Scale (2)', 'vector2', '#ff86a1');
        this.addInput(2, 'Out Scale (2)', 'vector2', '#ac7cff');
        this.addOutput(0, 'Out', 'number', '#ffd686');
        this.setWidth(185);
        this._generator = function(stateInputs, stateOutputs){
            let value = stateInputs[0];
            let inScale = stateInputs[1];
            let outScale = stateInputs[2];
            stateOutputs[0] = outScale.x + (value - inScale.x) * (outScale.y - outScale.x) / (inScale.y - inScale.x);
        };
    }
}

class Lerp extends Node {
    
    constructor(id, name = 'Lerp', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'X', 'number');
        this.addInput(1, 'Y', 'number');
        this.addInput(2, 'Step', 'number');
        this.addOutput(0, 'Out', 'number');
        this.setWidth(125);
        this._generator = function(stateInputs, stateOutputs){
            let value1 = stateInputs[0];
            let value2 = stateInputs[1];
            let amount = stateInputs[2];
            stateOutputs[0] =  (1 - amount) * value1 + amount * value2;
        };
    }
}

class Absolute extends Node {
    
    constructor(id, name = 'Absolute', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'X', 'number');
        this.addOutput(0, '|X|', 'number');
        this.setWidth(100);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = Math.abs(stateInputs[0]);
        };
    }
}

class OneMinus extends Node {
    
    constructor(id, name = 'One Minus', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'X', 'number');
        this.addOutput(0, 'Out', 'number');
        this.setWidth(100);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = 1 - stateInputs[0];
        };
    }
}

class Round extends Node {
    
    constructor(id, name = 'Round', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'X', 'number');
        this.addOutput(0, 'Out', 'number');
        this.setWidth(100);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = Math.round(stateInputs[0]);
        };
    }
}

class Floor extends Node {
    
    constructor(id, name = 'Floor', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'X', 'number');
        this.addOutput(0, 'Out', 'number');
        this.setWidth(100);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = Math.floor(stateInputs[0]);
        };
    }
}

class Ceil extends Node {
    
    constructor(id, name = 'Ceil', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'X', 'number');
        this.addOutput(0, 'Out', 'number');
        this.setWidth(100);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = Math.ceil(stateInputs[0]);
        };
    }
}

class Log extends Node {
    
    constructor(id, name = 'Log', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'X', 'number');
        this.addOutput(0, 'Out', 'number');
        this.setWidth(100);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = Math.log(stateInputs[0]);
        };
    }
}

class Exp extends Node {
    
    constructor(id, name = 'Exp', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'X', 'number');
        this.addOutput(0, 'Out', 'number');
        this.setWidth(100);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = Math.exp(stateInputs[0]);
        };
    }
}

class DotProduct2 extends Node {
    
    constructor(id, name = 'Dot Product', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'A (2)', 'vector2');
        this.addInput(1, 'B (2)', 'vector2');
        this.addOutput(0, 'Out', 'number');
        this.setWidth(125);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = dot(stateInputs[0], stateInputs[1]);
        };
    }
}

class DotProduct3 extends Node {
    
    constructor(id, name = 'Dot Product', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'A (3)', 'vector3');
        this.addInput(1, 'B (3)', 'vector3');
        this.addOutput(0, 'Out', 'number');
        this.setWidth(125);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = dot(stateInputs[0], stateInputs[1]);
        };
    }
}

class Distance2 extends Node {
    
    constructor(id, name = 'Distance', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'A (2)', 'vector2');
        this.addInput(1, 'B (2)', 'vector2');
        this.addOutput(0, 'Out', 'number');
        this.setWidth(130);
        this._generator = function(stateInputs, stateOutputs){
            let dx = stateInputs[0].x - stateInputs[1].x;
            let dy = stateInputs[0].y - stateInputs[1].y;
            stateOutputs[0] = Math.sqrt(Math.sq(dx) + Math.sq(dy));
        };
    }
}

class Distance3 extends Node {
    
    constructor(id, name = 'Distance', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'A (3)', 'vector3');
        this.addInput(1, 'B (3)', 'vector3');
        this.addOutput(0, 'Out', 'number');
        this.setWidth(130);
        this._generator = function(stateInputs, stateOutputs){
            let dx = stateInputs[0].x - stateInputs[1].x;
            let dy = stateInputs[0].y - stateInputs[1].y;
            let dz = stateInputs[0].z - stateInputs[1].z;
            stateOutputs[0] = Math.sqrt(Math.sq(dx) + Math.sq(dy) + Math.sq(dz));
        };
    }
}

class Add2 extends Node {
    
    constructor(id, name = 'Add', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'A (2)', 'vector2', '#fd696b');
        this.addInput(1, 'B (2)', 'vector2', '#6797ff');
        this.addOutput(0, 'Out', 'vector2', '#ffd686');
        this.setWidth(125);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = {x: stateInputs[0].x + stateInputs[1].x, y: stateInputs[0].y + stateInputs[1].y};
        };
    }
}

class Add3 extends Node {
    
    constructor(id, name = 'Add', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'A (3)', 'vector3', '#fd696b');
        this.addInput(1, 'B (3)', 'vector3', '#6797ff');
        this.addOutput(0, 'Out', 'vector3', '#ffd686');
        this.setWidth(125);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = {x: stateInputs[0].x + stateInputs[1].x, y: stateInputs[0].y + stateInputs[1].y, z: stateInputs[0].z + stateInputs[1].z};
        };
    }
}

class Subtract2 extends Node {
    
    constructor(id, name = 'Subtract', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'A (2)', 'vector2');
        this.addInput(1, 'B (2)', 'vector2');
        this.addOutput(0, 'Out', 'vector2');
        this.setWidth(125);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = {x: stateInputs[1].x - stateInputs[0].x, y: stateInputs[1].y - stateInputs[0].y};
        };
    }
}

class Subtract3 extends Node {
    
    constructor(id, name = 'Subtract', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'A (3)', 'vector3');
        this.addInput(1, 'B (3)', 'vector3');
        this.addOutput(0, 'Out', 'vector3');
        this.setWidth(125);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = {x: stateInputs[1].x - stateInputs[0].x, y: stateInputs[1].y - stateInputs[0].y, z: stateInputs[1].z - stateInputs[0].z};
        };
    }
}

class Multiply2 extends Node {
    
    constructor(id, name = 'Multiply', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'A (2)', 'vector2', '#fd696b');
        this.addInput(1, 'B (2)', 'vector2', '#6797ff');
        this.addOutput(0, 'Out', 'vector2', '#ffd686');
        this.setWidth(125);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = {x: stateInputs[0].x * stateInputs[1].x, y: stateInputs[0].y * stateInputs[1].y};
        };
    }
}

class Multiply3 extends Node {
    
    constructor(id, name = 'Multiply', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'A (3)', 'vector3', '#fd696b');
        this.addInput(1, 'B (3)', 'vector3', '#6797ff');
        this.addOutput(0, 'Out', 'vector3', '#ffd686');
        this.setWidth(125);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = {x: stateInputs[0].x * stateInputs[1].x, y: stateInputs[0].y * stateInputs[1].y, z: stateInputs[0].z * stateInputs[1].z };
        };
    }
}

class Split2 extends Node {
    
    constructor(id, name = 'Split', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'V (2)', 'vector2');
        this.addOutput(0, 'X', 'number');
        this.addOutput(1, 'Y', 'number');
        this.setWidth(110);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = stateInputs[0].x;
            stateOutputs[1] = stateInputs[0].y;
        };
    }
}

class Split3 extends Node {
    
    constructor(id, name = 'Split', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'V (3)', 'vector3');
        this.addOutput(0, 'X', 'number');
        this.addOutput(1, 'Y', 'number');
        this.addOutput(2, 'Z', 'number');
        this.setWidth(110);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = stateInputs[0].x;
            stateOutputs[1] = stateInputs[0].y;
            stateOutputs[2] = stateInputs[0].z;
        };
    }
}

class Split4 extends Node {
    
    constructor(id, name = 'Split', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'V (4)', 'vector4');
        this.addOutput(0, 'X', 'number');
        this.addOutput(1, 'Y', 'number');
        this.addOutput(2, 'Z', 'number');
        this.addOutput(3, 'W', 'number');
        this.setWidth(112);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = stateInputs[0].x;
            stateOutputs[1] = stateInputs[0].y;
            stateOutputs[2] = stateInputs[0].z;
            stateOutputs[3] = stateInputs[0].w;
        };
    }
}

class Merge2 extends Node {
    
    constructor(id, name = 'Merge', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'X', 'number');
        this.addInput(1, 'Y', 'number');
        this.addOutput(0, 'V (2)', 'vector2');
        this.setWidth(125);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = {x: stateInputs[0], y: stateInputs[1]};
        };
    }
}

class Merge3 extends Node {
    
    constructor(id, name = 'Merge', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'X', 'number');
        this.addInput(1, 'Y', 'number');
        this.addInput(2, 'Z', 'number');
        this.addOutput(0, 'V (3)', 'vector3');
        this.setWidth(125);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = {x: stateInputs[0], y: stateInputs[1], z: stateInputs[2]};
        };
    }
}

class Merge4 extends Node {
   
    constructor(id, name = 'Merge', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'X', 'number');
        this.addInput(1, 'Y', 'number');
        this.addInput(2, 'Z', 'number');
        this.addInput(3, 'W', 'number');
        this.addOutput(0, 'V (4)', 'vector4');
        this.setWidth(125);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = {x: stateInputs[0], y: stateInputs[1], z: stateInputs[2], w: stateInputs[3]};
        };
    }
}

// Tests

class Equals extends Node {
    
    constructor(id, name = 'Equals', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this.addInput(0, 'A', 'number');
        this.addInput(1, 'B', 'number');
        this.addOutput(0, 'Out', 'bool');
        this.setWidth(110);
        this._generator = function(stateInputs, stateOutputs){
            stateOutputs[0] = stateInputs[0] === stateInputs[1];
        };
    }
}

// Inputs
class Vector2 extends Node {
    constructor(id, name = 'Vector2 Input', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this._inputType = 'number';
        this.asInput('vector2', (inputs) => {
            return {x: parseFloat(inputs[0]), y: parseFloat(inputs[1])};
        });
        this.addInput(0, 'X', 'number');
        this.addInput(1, 'Y', 'number');
    }
}

class Vector2Constant extends Node {
    constructor(id, name = 'Vector2 Input', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this._inputType = 'number';
        this._isConstant = true;
        this.asInput('vector2', (inputs) => {
            return {x: parseFloat(inputs[0]), y: parseFloat(inputs[1])};
        });
        this.addInput(0, 'X', 'number');
        this.addInput(1, 'Y', 'number');
    }
}

class Vector3 extends Node {
    constructor(id, name = 'Vector3 Input', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this._inputType = 'number';
        this.asInput('vector3', (inputs) => {
            return {x: parseFloat(inputs[0]), y: parseFloat(inputs[1]), z: parseFloat(inputs[2])};
        });
        this.addInput(0, 'X', 'number');
        this.addInput(1, 'Y', 'number');
        this.addInput(2, 'Z', 'number');
    }
}

class Vector3Constant extends Node {
    constructor(id, name = 'Vector3 Input', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this._inputType = 'number';
        this._isConstant = true;
        this.asInput('vector3', (inputs) => {
            return {x: parseFloat(inputs[0]), y: parseFloat(inputs[1]), z: parseFloat(inputs[2])};
        });
        this.addInput(0, 'X', 'number');
        this.addInput(1, 'Y', 'number');
        this.addInput(2, 'Z', 'number');
    }
}

class Vector4 extends Node {
    constructor(id, name = 'Vector4 Input', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this._inputType = 'number';
        this.asInput('vector4', (inputs) => {
            return {x: parseFloat(inputs[0]), y: parseFloat(inputs[1]), z: parseFloat(inputs[2]), w: parseFloat(inputs[3])};
        });
        this.addInput(0, 'X', 'number');
        this.addInput(1, 'Y', 'number');
        this.addInput(2, 'Z', 'number');
        this.addInput(3, 'W', 'number');
    }
}

class Vector4Constant extends Node {
    constructor(id, name = 'Vector4 Input', inputs = [], outputs = []){
        super(id, name, inputs, outputs);
        this._inputType = 'number';
        this._isConstant = true;
        this.asInput('vector4', (inputs) => {
            return {x: parseFloat(inputs[0]), y: parseFloat(inputs[1]), z: parseFloat(inputs[2]), w: parseFloat(inputs[3])};
        });
        this.addInput(0, 'X', 'number');
        this.addInput(1, 'Y', 'number');
        this.addInput(2, 'Z', 'number');
        this.addInput(3, 'W', 'number');
    }
}

function validNumber(x){
    return typeof x === 'number' && !isNaN(x)
}

export default {
    name: 'Math',
    id: 'math',
    description: 'Basic math functions and vector functions',
    icon: {
        type: 'svg',
        path: 'M20,19.88V22L18.2,20.83L13.41,11.83C14.07,11.62 14.67,11.28 15.19,10.83L20,19.88M15,7A3,3 0 0,1 12,10C11.85,10 11.71,10 11.56,10L5.8,20.83L4,22V19.88L9.79,9C8.69,7.77 8.79,5.87 10.03,4.76C10.57,4.28 11.27,4 12,4V2A1,1 0 0,1 13,3V4.18C14.2,4.6 15,5.73 15,7M13,7A1,1 0 0,0 12,6A1,1 0 0,0 11,7A1,1 0 0,0 12,8A1,1 0 0,0 13,7Z'
    },
    types: { // Add custom types
        'vector2': {
            color: '#ffd686', 
            assertation: (vec) => vec !== undefined && validNumber(vec.x) && validNumber(vec.y)
        },
        'vector3': {
            color: '#a0d468', 
            assertation: (vec) => vec !== undefined && validNumber(vec.x) && validNumber(vec.y) && validNumber(vec.z)
        },
        'vector4': {
            color: '#2ecc96', 
            assertation: (vec) => vec !== undefined && validNumber(vec.x) && validNumber(vec.y) && validNumber(vec.z) && vvalidNumber(vec.w)
        }
    },
    nodes: {
        Add,
        Add2,
        Add3,

        Subtract,
        Subtract2,
        Subtract3,

        Multiply,
        Multiply2,
        Multiply2,
        Multiply3,
        Power,
        Log,
        Exp,
        Divide,
        Modulo,
        Sqrt,
    
        Sine,
        Cosine,
        Tan,
        ArcSine,
        ArcCosine,
        ArcTan,
        DegToRad,
        RadToDeg,

        Min,
        Max,
        Absolute,
        OneMinus,

        Remap,
        Lerp,
        Round,
        Floor,
        Ceil,

        DotProduct2,
        DotProduct3,
        Distance2,
        Distance3,

        Split2,
        Split3,
        Split4,
        Merge2,
        Merge3,
        Merge4,
        
        Equals,
    },
    inputs: {
        Vector2,
        Vector2Constant,
        Vector3,
        Vector3Constant,
        Vector4,
        Vector4Constant
    }
};