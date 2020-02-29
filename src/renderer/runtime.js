export default class Runtime {

    run(){
        new Promise((resolve, reject) => {
            let inputNodes = [];
            let outputs = {};
            this.nodes.forEach(node => {
                if(node.isInput){
                    inputNodes.push(node);
                    outputs[node.id] = node.getOutputs();
                }
            });

            console.log('Start nodes', inputNodes, 'with', outputs);
            let todo = inputNodes;
            let max = 20, wt = 0;
            while(todo.length > 0 && max > wt){
                let nTodo = [];
                todo.forEach(node => {
                    let next = this.getNext(node);

                    next.forEach(link => {
                        let n = link.to.next;
                        let from = link.from.from;
                        if(link.to.inputId != undefined && outputs[from.id] && link.from.outputId != undefined){
                            n.setInput(link.to.inputId, outputs[from.id][link.from.outputId]);
                        }
                    });

                    next.forEach(link => {
                        let n = link.to.next;
                        console.log('%cValidating', 'color:blue', n);
                        if(n.asEnoughInput()){
                            outputs = {...outputs, ...n.getOutputs()};
                            if(n.hasOutputs()){
                                console.log('%cKeeping (hasOutputs)', 'color:red', n);
                                nTodo.push(n);
                            } else {
                                console.log('%cPassing', 'color:green', n);
                            }
                        } else {
                            console.log('%cKeeping (asNotEnoughInputs)', 'color:red', n);
                            nTodo.push(n);
                        }
                    });
                })
                todo = nTodo;
                wt++;
            }
            if(wt == max){
                console.log('Max call size reached');
                return;
            }
            console.log('Output', outputs[0]);
        });
    }

    getNext(currentNode){
        let nextNodes = [];
        let connectedNodes = this.connections[currentNode.id];
        connectedNodes.forEach(c => {
            if(this.links[c].from.from.id == currentNode.id){
                nextNodes.push(this.links[c]);
            }
        });
        return nextNodes;
    }


}