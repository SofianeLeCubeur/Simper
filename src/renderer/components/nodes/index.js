import { Node, types } from './node'
const defaultTypes = {...types};

function setOrAdd(obj, key, val){
    if(obj[key] !== undefined){
        obj[key] = {...obj[key], ...val};
    } else {
        obj[key] = val;
    }
}

export default class NodeManager {

    constructor(){
        this._nodes = {};
        this._dictionnaries = {};
    }

    addDictionary(dictionnary){
        if(typeof dictionnary !== 'object' || dictionnary.name == undefined || this._dictionnaries[dictionnary.name]) return;

        this._dictionnaries[dictionnary.name] = dictionnary;

        if(dictionnary.nodes){
            setOrAdd(this._nodes, dictionnary.name, dictionnary.nodes);
        }

        if(dictionnary.types){
            Object.keys(dictionnary.types).forEach(type => {
                types[type] = dictionnary.types[type];
            });
        }

        if(dictionnary.inputs){
            setOrAdd(this._nodes, 'Inputs', dictionnary.inputs);
        }
    }

    removeDictionary(dictionnary){
        if(this._dictionnaries[dictionnary.name]){
            delete this._dictionnaries[dictionnary.name];
            // TODO
        }
    }

    hasDictionnary(dictionnary){
        return !!this._dictionnaries[dictionnary.name];
    }

    list(){
        return {...this._dictionnaries};
    }

    findOrigin(nodeName){
        let dictionnary = undefined;
        Object.keys(this._nodes).forEach(dictionnaryName => {
            Object.keys(this._nodes[dictionnaryName]).forEach(node => {
                if(node === nodeName){
                    dictionnary = dictionnaryName;
                }
            });
        });
        return dictionnary;
    }

    clear(){
        this._dictionnaries = {};
        this._nodes = {};
        Object.keys(types).forEach(type => {
            if(defaultTypes[type]){
                types[type] = defaultTypes[type];
            } else {
                delete types[type];
            }
        });
    }

    get nodes(){
        return this._nodes;
    }

    get dictionnaries(){
        return Object.values(this._dictionnaries);
    }

}
//export default { Input: InputsNodes, Math: MathNodes, Misc: MiscNodes, String: StringNodes, Images: ImageNodes };