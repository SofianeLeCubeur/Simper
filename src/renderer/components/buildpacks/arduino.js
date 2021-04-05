import Buildpack from './buildpack'

export default class Arduino extends Buildpack {

    static buildpackVersion = 'v0.2.0';
    static buildpackColor = '#00878F';
    static buildpackAccentColor = '#ffffff';

    constructor(){
        super('Arduino');
        this._requiredDictionaries = ['basic_input', 'misc', 'arduino'];
        this._requiredInputNodes = ['Setup', 'Loop'];
        this._requiredOutputNodes = [];
        this._requiredBlocks = ['setup', 'loop'];
        this._allowBlocks = true;
    }
}