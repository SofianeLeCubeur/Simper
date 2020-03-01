let types = {
    '*': {
        color: '#ffffff', assertation: (v) => true
    },
    'bool': {
        color: '#ac7cff', assertation: (v) => typeof v === 'boolean'
    },
    'number': {
        color: '#fd696b', assertation: (v) => typeof v === 'number' && !isNaN(v),
    },
    'string': {
        color: '#7dcaff', assertation: (v) => typeof v === 'string',
    }
};

export { types }

export class Node {

    constructor(id, name, inputs = [], outputs = []){
        this._id = id;
        this._name = name;
        this._definition;
        this._inputs = inputs;
        this._outputs = outputs;
        this._generator = function(){};
        this._swidth = 190;
        this._inputStates = {};
    }

    getInput(id){
        let input = this._inputs.filter(r => r.id == id)[0];
        input.color = types[input.type] ? types[input.type].color : '#f5f5f5';
        return input;
    }

    getOutput(id){
        let output = this._outputs.filter(r => r.id == id)[0];
        output.color = types[output.type] ? types[output.type].color : '#f5f5f5';
        return output;
    }

    asInput(type, assign, outputName = 'Out'){
        this._input = true;
        this._inputAssign = assign;
        this.addOutput(0, outputName, type);

        return this;
    }

    hasOutputs(){
        return this.outputs.length > 0;
    }

    hasInputWith(type){
        if(this._input) return false;
        let hasType = false;
        this._inputs.forEach(inp => {
            hasType = hasType || inp.type === '*' || inp.type === type;
        });
        return hasType;
    }

    hasOutputWith(type){
        let hasType = false;
        this._outputs.forEach(out => {
            hasType = hasType || out.type === '*' || out.type === type;
        });
        return hasType;
    }

    setReference(reference){
        this._ref = reference;
        return this;
    }

    setWidth(width){
        this._swidth = width + 'px';

        return this;
    }

    setDefinition(definition){
        this._definition = definition;

        return this;
    }

    setInput(id, value, verbose=false){
        this._inputStates[id] = value;
        if(verbose) console.printLog({content: '%c[Node] (' + this._name + ') Seting input #' + id + ' to ' + (typeof value === 'object' ? JSON.stringify(value, null, 2) : value), 
        $style: ['color:#bada55'], tag: 'Debug'})
    }

    setPreview(renderer){
        this._hasPreview = true;
        this._previewRenderer = renderer;
    }

    hasEnoughInput(){
        let aei = true;
        this.inputs.forEach(input => {
            if(!types[input.type].assertation(this._inputStates[input.id])){
                aei = false;
            }
        });
        return aei;
    }

    addInput(id, name, type){
        this._inputs.push({
            id,
            name,
            type
        });
        return this;
    }

    addOutput(id, name, type){
        this._outputs.push({
            id,
            name,
            type
        });
        return this;
    }

    setGenerator(generator){
        this._generator = generator;
    }

    getInputState(id){
        return this._inputStates[id];
    }

    resetInputStates(){
        this._inputStates = {};
    }

    getOutputs(verbose=false){
        let outputs = {};
        this._generator(this._inputStates, outputs);
        if(verbose) console.printLog({content: '%c[Node] (' + this._name + ') Generator: %c' + JSON.stringify(outputs, null, 2),
            $style: ['color:pink','color:hotpink'], tag: 'Debug'})
        return outputs
    }

    get hasReference(){
        return !!this._ref;
    }

    get reference(){
        return this._ref;
    }

    get id(){
        return this._id;
    }

    get name(){
        return this._name;
    }

    set name(name){
        this._name = name;
    }

    get inputs(){
        return this._inputs;
    }

    get outputs(){
        return this._outputs;
    }

    get width(){
        return this._swidth;
    }

    get definition(){
        return this._definition;
    }

    get isInput(){
        return this._input;
    }

    get state(){
        return this._inputStates;
    }

}