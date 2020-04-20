import Buildpack from './buildpack'

export default class Arduino extends Buildpack {

    constructor(){
        super('Arduino', 'v1.0.0');
        this._requiredDictionaries = ['basic_input', 'misc', 'arduino'];
        this._requiredInputNodes = ['Setup', 'Loop'];
        this._requiredOutputNodes = [];
        this._requiredBlocks = ['setup', 'loop'];
        this._allowBlocks = true;
    }
}