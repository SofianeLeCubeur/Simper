import Buildpack from './buildpack'

export default class Arduino extends Buildpack {

    constructor(){
        super('Arduino', 'v1.0.0');
        this._requiredDictionaries = ['basic_inputs', 'misc', 'arduino'];
        this._requiredInputNodes = [];
        this._requiredOutputNodes = [];
        this._requiredBlocks = ['setup', 'loop'];
        this._allowBlocks = true;
    }
}