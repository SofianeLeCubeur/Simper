<template>
<div class="popup" @click.stop v-if="creatingNode" :style="selectorPos">
    <input type="text" placeholder="Node:CustomName" v-model="nodeName" @keyup.enter="create" tabindex="0" @keyup="filter">
    <div class="close" @click="$store.commit('set_creating_node', false)">
        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="currentColor" d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z" />
        </svg>
    </div>
    <ul class="complete">
        <template v-if="displayedCount > 0">
            <template v-for="(nodes, category) in displayedNodeDict">
                <template v-if="nodes.length > 0">
                    <li :key="`c${category}`" class="category">{{ category }} ({{ nodes.length }})</li>
                    <li v-for="node in nodes" :key="node" @click="select(node)" @keyup.enter="select(node)" tabindex="1">{{ node }}</li>
                </template>
            </template>
        </template>
        <template v-else>
            <li class="category">No result for '{{ nodeName }}'</li>
        </template>
    </ul>
</div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

let rd = () => Math.random();

export default {
    props: [ 'links', 'activeLink' ],
    data(){
        return {
            displayedNodeDict: {},
            nodeName: null
        }
    },
    watch: {
        creatingNode(b){
            this.nodeName = null;
            let n = {};
            Object.keys(this.nodeDict).forEach(category => n[category] = Object.keys(this.nodeDict[category]));
            this.displayedNodeDict = n;
            if(b){
                this.$nextTick(() => this.$el.querySelector('input').focus())
                this.filter();
            }
        }
    },
    methods: {
        filter(){
            if(!this.nodeName){
                Object.keys(this.displayedNodeDict).forEach(category => {
                    const keys = Object.keys(this.nodeDict[category]);
                    this.displayedNodeDict[category] = keys.filter(k => {
                        if(this.activeLink != -1){
                            const link = this.links[this.activeLink];
                            if(link){
                                const isInput = link.from.inputId !== undefined;
                                const io = isInput ? link.from.from.getInput(link.from.inputId) : link.from.from.getOutput(link.from.outputId);
                                if(io.type == '*'){
                                    return k != link.from.from.constructor.name;
                                }

                                const vNode = new this.allNodes[k](rd());
                                return isInput ? vNode.hasOutputWith(io.type) : vNode.hasInputWith(io.type) && k != link.from.from.constructor.name;
                            }
                        }
                        return true;
                    });
                });
                return;
            } else if(this.nodeName){
                Object.keys(this.displayedNodeDict).forEach(category => {
                    const keys = Object.keys(this.nodeDict[category]);
                    this.displayedNodeDict[category] = keys.filter(k => k.toLowerCase().indexOf(this.nodeName.split(':')[0].toLowerCase()) >= 0);
                });
            }
        },
        select(val){
            if(this.creatingNode){
                const input = this.$el.querySelector('.popup input');
                if(this.nodeName && val.toLowerCase().startsWith(this.nodeName.toLowerCase())){
                    this.nodeName = val;
                    this.create();
                } else {
                    this.nodeName = val;
                    input.focus();
                }
            }
        },
        create(){
            if(this.creatingNode){
                if(!this.nodeName){
                    this.$store.dispatch('update_creating_node', false);
                    return;
                }
                let input = this.nodeName.split(':');
                let count = this.displayedCount;
                if(count == 1 &&
                    this.lastDisplayedNode.toLowerCase().startsWith(input[0].toLowerCase())){
                    input[0] = this.lastDisplayedNode;
                }
                let name = undefined;
                let instance = this.allNodes[input[0]];
                if(input.length > 1){
                    name = input[1];
                }
                if(input[0].toLowerCase() == 'variable' && !name){
                    return;
                }
                if(instance){
                    let node;
                    if(name != undefined){
                        node = new instance(rd(), name);
                    } else {
                        node = new instance(rd());
                    }
                    this.$emit('pushNode', node);
                }
                this.$store.dispatch('update_creating_node', false);
            }
        }
    },
    computed: {
        displayedCount(){
            let count = 0;
            Object.keys(this.displayedNodeDict).forEach(category => count += this.displayedNodeDict[category].length);
            return count;
        },
        lastDisplayedNode(){
            let node = undefined;
            Object.keys(this.displayedNodeDict).forEach(category => {
                if(this.displayedNodeDict[category].length === 1){
                    node = this.displayedNodeDict[category][0];
                }
            });
            return node;
        },
        allNodes(){
            let n = {};
            Object.keys(this.nodeDict).forEach(category => n = {...n, ...this.nodeDict[category]});
            return n;
        },
        ...mapGetters([ 'nodeDict', 'selectorPos', 'creatingNode' ])
    }
}
</script>

<style lang="scss">
.popup {
    position: absolute;
    z-index: 300;
    border: 1px solid #131313;
    background: #424242;

    &:focus-within {
        box-shadow: 0 0 0 1px #4f98ca;
    }

    .complete {
        list-style: none;
        display: flex;
        flex-flow: column nowrap;
        color: #bebebe;
        user-select: none;
        max-height: 150px;
        overflow-y: auto;

        li {
            padding: 3px 5px;
            cursor: pointer;
            border-top: 1px solid #131313;
            outline: none;

            &.category, &.category:hover {
                background: #333333;
                cursor: default;
                text-align: center;
            }

            &:hover {
                background: #505050;
            }
        }
    }

    .close {
        color: #e6e6e6;
        position: absolute;
        top: 7px;
        right: 3px;
        cursor: pointer;
    }

    input {
        border: none;
        background: transparent;
        width: 100%;
        height: 100%;
        outline: none;
        color: #e6e6e6;
        padding: 10px 28px 10px 10px;
        font-size: 16px;
    }
}
</style>