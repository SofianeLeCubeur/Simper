import NodeManager from './../../components/nodes'

const state = {
    // States
    editing: false,
    creatingNode: false,
    editingDictionaries: false,
    // Objects
    selectorPos: {x: 0, y: 0},
    nodeManager: new NodeManager()
}

const getters = {
    nodeManager: (state) => state.nodeManager,
    nodeDict: (state) => state.nodeManager.nodes,
    selectorPos: (state) => state.selectorPos,
    // States
    editing: (state) => state.editing,
    creatingNode: (state) => state.creatingNode,
    editingDictionaries: (state) => state.editingDictionaries
};
  
const mutations = {
    set_editing: (state, st) => state.editing = st,
    set_editing_dictionaries: (state, st) => state.editingDictionaries = st,
    set_selector_pos: (state, pos) => state.selectorPos = pos,
    set_creating_node: (state, st) => state.creatingNode = st
}
  
const actions = {
    update_editing(context, st) {
        console.log('set_editing', st);
        context.commit('set_editing', st);
    },
    update_editing_dictionaries(context, st){
        console.log('set_editing_dictionaries', st);
        context.commit('set_editing_dictionaries', st)
    },
    update_selector_pos(context, pos){
        console.log('set_selector_pos', pos);
        context.commit('set_selector_pos', pos);
    } ,
    update_creating_node(context, st){
        console.log('set_creating_node', st);
        context.commit('set_creating_node', st);
    },
    init(context){
        context.state.creatingNode = false;
    }
}
  
export default {
    state,
    getters,
    mutations,
    actions
}