import Vue from 'vue'
import Vuex from 'vuex'
import { createPersistedState, createSharedMutations } from 'vuex-electron'
//import modules from './modules'
import NodeManager from './../components/nodes'

Vue.use(Vuex)

const state = {
    // States
    buildpack: null,
    availableDictionnaries: {},
    availableBuildpacks: {},
    editing: false,
    creatingNode: true,
    editingDictionaries: false,
    // Objects
    selectorPos: {x: 0, y: 0},
    nodeManager: new NodeManager(),
    show_debug_bounds: false,
    show_run_profiles: false,
    show_buildpacks: true
}

const getters = {
    buildpack: (state) => state.buildpack,
    buildpacks: (state) => state.availableBuildpacks,
    dictionnaries: (state) => state.availableDictionnaries,
    nodeManager: (state) => state.nodeManager,
    nodeDict: (state) => state.nodeManager.nodes,
    selectorPos: (state) => state.selectorPos,
    // States
    editing: (state) => state.editing,
    creatingNode: (state) => state.creatingNode,
    editingDictionaries: (state) => state.editingDictionaries,
    showDebugBounds: (state) => state.show_debug_bounds,
    showRunProfiles: (state) => state.show_run_profiles,
    showBuildpacks: (state) => state.show_buildpacks
};
  
const mutations = {
    set_buildpack: (state, bp) => state.buildpack = bp,
    set_editing: (state, st) => state.editing = st,
    set_editing_dictionaries: (state, st) => state.editingDictionaries = st,
    set_selector_pos: (state, pos) => state.selectorPos = pos,
    set_creating_node: (state, st) => state.creatingNode = st,
    set_debug_bounds: (state, st) => state.show_debug_bounds = st,
    set_show_run_profiles: (state, st) => state.show_run_profiles = st,
    set_dictionnaries: (state, st) => state.availableDictionnaries = st,
    set_buildpacks: (state, st) => state.availableBuildpacks = st,
    set_show_buildpacks: (state, st) => state.show_buildpacks = st,
}
  
const actions = {
    update_buildpack(context, bp){
        context.commit('set_buildpack', bp);
    },
    update_editing(context, st) {
        context.commit('set_editing', st);
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
