import Vue from 'vue'
import Vuex from 'vuex'
import Simper from './../components/buildpacks/simper'
import MathPlan from './../components/buildpacks/math'
import Arduino from './../components/buildpacks/arduino'
import { createPersistedState, createSharedMutations } from 'vuex-electron'
//import modules from './modules'
import NodeManager from './../components/nodes'

Vue.use(Vuex)

const state = {
    // States
    buildpack: new Arduino(),
    editing: false,
    creatingNode: true,
    editingDictionaries: false,
    // Objects
    selectorPos: {x: 0, y: 0},
    nodeManager: new NodeManager(),
    show_debug_bounds: false,
    show_run_profiles: false
}

const getters = {
    buildpack: (state) => state.buildpack,
    nodeManager: (state) => state.nodeManager,
    nodeDict: (state) => state.nodeManager.nodes,
    selectorPos: (state) => state.selectorPos,
    // States
    editing: (state) => state.editing,
    creatingNode: (state) => state.creatingNode,
    editingDictionaries: (state) => state.editingDictionaries,
    showDebugBounds: (state) => state.show_debug_bounds,
    showRunProfiles: (state) => state.show_run_profiles
};
  
const mutations = {
    set_buildpack: (state, bp) => state.buildpack = bp,
    set_editing: (state, st) => state.editing = st,
    set_editing_dictionaries: (state, st) => state.editingDictionaries = st,
    set_selector_pos: (state, pos) => state.selectorPos = pos,
    set_creating_node: (state, st) => state.creatingNode = st,
    set_debug_bounds: (state, st) => state.show_debug_bounds = st,
    set_show_run_profiles: (state, st) => state.show_run_profiles = st
}
  
const actions = {
    update_buildpack(context, bp){
        context.commit('set_buildpack', bp);
    },
    update_editing(context, st) {
        context.commit('set_editing', st);
    },
    update_editing_dictionaries(context, st){
        context.commit('set_editing_dictionaries', st)
    },
    update_selector_pos(context, pos){
        context.commit('set_selector_pos', pos);
    },
    update_creating_node(context, st){
        context.commit('set_creating_node', st);
	},
    update_show_run_profiles(context, st){
        context.commit('set_show_run_profiles', st);
	},
	add_dictionary(context, dictionary){
		let dict = context.state.nodeManager;
		dict.addDictionary(dictionary);
		context.state.nodeManager = dict;
    },
    reset_dictionnaries(context){
        let dict = context.state.nodeManager;
		dict.clear();
    },
    set_bounds_debuging(context, show_debug_bounds){
        context.commit('set_debug_bounds', show_debug_bounds);
    }
}

export default new Vuex.Store({
	state,
    getters,
    mutations,
    actions,
  	strict: false
})
