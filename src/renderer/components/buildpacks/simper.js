import Buildpack from './buildpack'

export default class Simper extends Buildpack {

    constructor(){
        super('Simper', 'v1.0.0');
        this._requiredDictionaries = ['basic_inputs', 'misc'];
        this._requiredInputNodes = [];
        this._requiredOutputNodes = ['Print']; 
    }

    run(script, nodes, verbose=true){
        this.prepare(script, nodes);

        while(Object.keys(this.nextNodes).length > 0){
            // Main loop
            if(verbose) console.log('%c<----%c Run Trace #' + this._run + ' %c---->', 'color:tomato', 'background:tomato;color:white', 'color:tomato');
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
        this.nodes = nodes;
        this.links = script.links;
        this.nextNodes = {};
        this.outputs = {};
        this._run = 0;
        this.nodes.filter(node => node._input).forEach(node => {
            this.nextNodes[node.id] = this.getNext(this.links, node);
            this.outputs[node.id] = node.getOutputs();
        }); // Prepare input nodes
    }

    getNext(links, node){
        let nodes = [];
        links.forEach(link => {
            if(link.from.nid === node.id){ 
                nodes.push({...link.to, from_io: link.from.oid});
            } else if(link.to.nid === node.id && !this.outputs[node.id]){
                // Reversed links: when the user links the two nodes but the from node is actually the to node
                // [!!!!!!!] TODO: Fix an issue where multiple nodes are called because somehow they match the set of conditions FURTHER DEBUGGING REQUIRED
                nodes.push({...link.from, from_io: link.to.oid});
                console.log('current',node.id,node.constructor.name,'from',link.from.nid,'to',link.to.nid);
            }
        });
        return nodes;
    }

}