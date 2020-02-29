export default class Buildpack {

    constructor(name, version){
        this._name = name;
        this._version = version;
        this._requiredDictionaries = [];
        this._requiredInputNodes = [];
        this._requiredOutputNodes = [];
        this._allowExternalDictionaries = true;
        this._allowOutputLinkSplitting = true; // Allow multiple links to be connected to a single output
        this._allowConstants = true;
        this._allowVariables = true;
        this._allowVariableImportation = true;
        this._runtimeSettings = {};
    }

    run(script){
    }

    get name(){
        return this._name;
    }

    get version(){
        return this._version;
    }

    get requiredInputNodes(){
        return this._requiredInputNodes;
    }

    get requiredOutputNodes(){
        return this._requiredOutputNodes;
    }

    get allowExternalDictionaries(){
        return this._allowExternalDictionaries;
    }

    get allowOutputSplitting(){
        return this._allowOutputLinkSplitting;
    }

    get allowConstants(){
        return this._allowConstants;
    }

    get allowVariables(){
        return this._allowVariables;
    }

    get allowVariableImportation(){
        return this._allowVariableImportation;
    }

    get runtimeSettings(){
        return this._runtimeSettings;
    }

    set(key, val){
        this._runtimeSettings[key] = val;
    }

    get(key){
        return this._runtimeSettings[key];
    }
}