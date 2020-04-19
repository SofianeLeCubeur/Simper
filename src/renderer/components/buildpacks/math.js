import Buildpack from './buildpack'

function remap(x, inMin, inMax, outMin, outMax) {
    return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

export default class MathPlan extends Buildpack {

    constructor(){
        super('MathPlan', 'v0.1.0');
        this._requiredDictionaries = ['basic_input', 'misc', 'math', 'math_plan'];
        this._requiredInputNodes = ['X', 'Y'];
        this._requiredOutputNodes = ['Graph'];
    }

    run(script, nodes, verbose=true){
        this._points = [];
        this._graph = nodes.filter(node => {
            return node.reference === 'buildpack/MathPlan:output0'
        })[0];
        this._xinput = nodes.filter(node => {
            return node.reference === 'buildpack/MathPlan:input0'
        })[0];
        this._yinput = nodes.filter(node => {
            return node.reference === 'buildpack/MathPlan:input1'
        })[0];

        this.nodes = [...nodes];
        this.links = script.links;
        
        let xMin = -5;
        let yMin = -5;
        let xMax = 5;
        let yMax = 5;
        let points = [];

        for(let x = xMin; x <= xMax; x += 0.01){
            this._xinput.setGenerator((inputs, stateOutput) => {
                stateOutput[0] = x
            });

            this.prepare(script, nodes);
            this.doRun();
            const id = this._graph.id;
            const output = this.outputs[id];
            let y = output[0].y;

            let normalizedX = 1-remap(x, xMin, xMax, 0, 1);
            let normalizedY = 1-remap(y, yMin, yMax, 0, 1);
            points.push({x: normalizedX, y: normalizedY});
        }

        const ctx = this._graph._preview.getContext('2d');
        console.log('Rendering ' + points.length + ' points');
        this._graph._renderPoints(ctx, this._graph._preview, points);
    }

    doRun(verbose=false){
        while(Object.keys(this.nextNodes).length > 0){
            // Main loop
            if(verbose) console.printLog({content: '%c├────%c Call Trace #' + this._run + ' %c────┤', $style: ['color:tomato', 'background:tomato;color:white', 'color:tomato'],tag:'Debug'});
            let newNextNodes = {};
            Object.keys(this.nextNodes).forEach(nodeId => {
                let next_links = this.nextNodes[nodeId];
                next_links.forEach(link => {
                    let node = this.nodes.filter(n => n.id === link.nid)[0];
                    node.setInput(link.iid, this.outputs[nodeId][link.from_io], verbose);
                });
                next_links.forEach(link => {
                    let node = this.nodes.filter(n => n.id === link.nid)[0];
                    if(node.hasEnoughInput()){
                        this.outputs[node.id] = node.getOutputs(verbose);
                        newNextNodes[node.id] = this.getNext(this.links, node);
                    }
                });
            });
            this.nextNodes = newNextNodes;
            this._run++;
        }
    }

    prepare(script, nodes){
        this.nextNodes = {};
        this.outputs = {};
        this._run = 0;
        this.nodes.filter(node => { 
            node.resetInputStates();
            return node._input;
        }).forEach(node => {
            this.nextNodes[node.id] = this.getNext(this.links, node);
            this.outputs[node.id] = node.getOutputs();
        }); // Prepare input nodes
    }

    getNext(links, node){
        let nodes = [];
        links.forEach(link => {
            if(link.from.nid === node.id){ 
                nodes.push({...link.to, from_io: link.from.oid});
            } else if(link.to.nid === node.id && (!this.outputs[node.id] || node._input)){
                // Reversed links: when the user links the two nodes but the from node is actually the to node
                // [!!!!!!!] TODO: Fix an issue where multiple nodes are called because somehow they match the set of conditions FURTHER DEBUGGING REQUIRED
                nodes.push({...link.from, from_io: link.to.oid});
                //console.log('current',node.id,node.constructor.name,'from',link.from.nid,'to',link.to.nid);
            }
        });
        return nodes;
    }

}