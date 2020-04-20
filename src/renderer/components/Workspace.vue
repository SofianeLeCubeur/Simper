<template>
  <div class="space" v-dragscroll:nochilddrag @mousemove="move" @click="click" @scroll="pass = true"
    @contextmenu="stopEditingFuture">
        <NodeRenderer v-for="node in nodes" 
            :key="node.id" 
            :node="node"
            :lock="mode === 'run'"
            :activeIO="[]"
            :ref="`n${node.id}`"
            @link="edit($event, true)"
            @out="edit($event, false)"
            @delete="deleteNode(node)"
            @click="pass = true"
            @update="onUpdate"
            @updateEnd="updateBounds"></NodeRenderer>

        <Link v-for="(l, key) in links" 
            :key="key" 
            :from="l.from" 
            :to="l.to" 
            :ref="`l${key}`"
            :color="l.color"
            :lock="mode === 'run'"
            :id="l.id"
            @clicked="removeLink($event, key)"
            @click="pass = true" />

        <NodeSelector :links="links" :activeLink="activeLink" @pushNode="pushNode"></NodeSelector>

        <DictionariesDialog @close="updateDictionnaries"></DictionariesDialog>
        <Console :visible="console_visible" @expand="console_visible = true" @reduce="console_visible = false"></Console>
        <RunWithDialog :visible="showRunProfiles" @close="closeProfiles"></RunWithDialog>

        <div class="border" v-if="showDebugBounds">
            <div class="label" v-if="nodes.length > 0" @click.stop>{{ script_name }}</div>
        </div>

        <Block v-for="block in blocks" :block="block" :key="block.name"></Block>
  </div>
</template>

<script>
import NodeManager from './nodes'
import NodeRenderer from './NodeRenderer'
import Dialog from './Dialog'
import Link from './Link'
import DictionariesDialog from './dialogs/DictionariesDialog'
import RunWithDialog from './dialogs/RunWithDialog'
import NodeSelector from './NodeSelector'
import Console from './Console'
import Block from './Block'

import { dragscroll } from 'vue-dragscroll'
import { ipcRenderer, remote } from 'electron'
import { mapGetters } from 'vuex'

import input from './nodes/input'
import math from './nodes/math'
import misc from './nodes/misc'
import string from './nodes/string'
import arduino from './nodes/arduino'
import MathPlan from './nodes/math_plan'

const dictionaries = {
    'basic_input': input,
    'misc': misc,
    'math': math,
    'string': string,
    'arduino': arduino,
    'math_plan': MathPlan
};

import Arduino from './buildpacks/arduino'
import Simper from './buildpacks/simper'
import mathplan from './buildpacks/math'

const buildpacks = {
    'Arduino': Arduino,
    'Simper': Simper,
    'MathPlan': mathplan
};

const { dialog } = remote;
const fs = require('fs');
const os = require('os');

let rd = () => Math.random();

export default {
    components: { NodeRenderer, Link, Dialog, DictionariesDialog, NodeSelector, Console, RunWithDialog, Block },
    data(){
        return {
            script_name: 'Untitled Script',
            nodes: [],
            links: {},
            connections: {},
            activeLink: -1,
            connectToOutput: false,
            nodeName: null,
            pass: false,
            spawnPoint: {},
            mode: 'build',
            bounds: {},
            console_visible: false,
            blocks: []
        }
    },
    mounted(){
        this.$store.dispatch('update_creating_node', false);
        this.setupBuildpackBuiltins();

        /*let maxWorkspaceZoom = 5;
        let minWorkspaceZoom = 0.3;
        let currentZoom = 1;
        window.addEventListener("wheel", event => {
            if(event.deltaY < 0){
                currentZoom += 0.01;
                currentZoom = Math.min(currentZoom, maxWorkspaceZoom);
            } else if(event.deltaY > 0){
                currentZoom -= 0.01;
                currentZoom = Math.max(currentZoom, minWorkspaceZoom);
            }
            console.log(currentZoom.toFixed(2));
            event.stopImmediatePropagation();
            this.$el.parentNode.style.zoom = currentZoom.toFixed(2);
        });*/

        let savedOnce = false;
        ipcRenderer.on('menu:update', (event, payload) => {
            if(payload.type === 'file:save_as' || (!savedOnce && payload.type === 'file:save')){
                let content = JSON.stringify(this.export(this.script_name));
                let fileName = dialog.showSaveDialogSync({ title: 'Save script as...' });
                if (fileName === undefined){
                    alert("You didn't save the file");
                    return;
                }

                fs.writeFile(fileName, content, (err) => {
                    if(err){
                        alert("An error ocurred creating the file:" + err.message);
                        return;
                    }
                                        
                    alert("The file has been succesfully saved");
                });
            }
            else if(payload.type === 'file:open'){
                let fileName = dialog.showOpenDialogSync({ title: 'Open', properties: ['openFile'] });
                if(fileName != undefined){
                    let path = fileName[0];
                    if(path !== undefined){
                        if(fs.existsSync(path)){
                            let content = fs.readFileSync(path, 'utf8');
                            try {
                                this.import(JSON.parse(content));
                            } catch(e){
                                alert('Error: The selected file cannot be read.');
                                console.error('Unable to read the file', e);
                            }
                        }
                    }
                }
            } 
            else if(payload.type === 'edit:node:add'){
				this.pass = false;
                this.click({clientX: 0, clientY: 0});
            }
            else if(payload.type === 'build:run'){
                const style = 'background-color:rgba(0,0,0,.2);padding:5px;color:#f5f5f5;max-width:100%;width:100%;';
                let start = Date.now();
                console.printLog({content: '%cScript Running...', $style: [style]});
                this.buildpack.run(this.export(0, 0, true),this.nodes);
                console.printLog({content: '%cScript was ran in ' + (Date.now() - start) / 1000 + 's', $style: [style]});
            } 
            else if(payload.type === 'build:mode:run'){
                this.mode = 'run';
                this.$store.dispatch('update_creating_node', false);
                this.$forceUpdate();
            }
            else if(payload.type === 'build:run_with'){
                this.$store.dispatch('update_show_run_profiles', true);
            }
            else if(payload.type === 'build:mode:build'){
                this.mode = 'build';
                this.$store.dispatch('update_creating_node', false);
                this.$forceUpdate();
            } 
            else if(payload.type === 'edit:clear'){
                this.resetState();
            } 
            else if(payload.type === 'edit:dictionnaries'){
                this.$store.dispatch('update_editing_dictionaries', true);
            } 
            else if(payload.type === 'edit:fix_links'){
                this.nodes.forEach(node => this.onUpdate({node}));
            }
            else if(payload.type === 'edit:recenter'){
                let relativePositions = {};
                this.nodes.forEach(node =>
                    relativePositions[node.id] = {x: (node.spawnPosition.x - this.bounds.x) / this.bounds.w, y: (node.spawnPosition.y - this.bounds.y) / this.bounds.h}
                );
                this.recenterBounds();
                this.renderBounds();
                this.nodes.forEach((node,i) => {
                    let relative_pos = relativePositions[node.id];
                    node.spawnPosition = {x: Math.floor(this.bounds.x + this.bounds.w * relative_pos.x), 
                        y: Math.floor(this.bounds.y + this.bounds.h * relative_pos.y) };
                    this.$refs['n'+node.id][0].updatePos(node.spawnPosition);
                });
            }
            else if(payload.type === 'view:bounds'){
                let next = !this.showDebugBounds;
                this.$store.dispatch('set_bounds_debuging', next);
                if(next){
                    this.$nextTick(() => this.updateBounds());
                }
            }
        });
    },
    destroyed(){
        this.nodeManager.clear();
    },
    methods: {
        click(e){
            if(this.pass){
                this.pass = false;
                return;
            }
            if(this.mode !== 'build') return;
            if(!this.creatingNode){
                this.$store.dispatch('update_creating_node', true);
                this.$nextTick(() => {
                    let x = Math.max(e.clientX + this.$el.scrollLeft - 50, 5);
                    let y = Math.max(e.clientY + this.$el.scrollTop - 5, 5);
                    this.spawnPoint = {x, y};
                    this.$store.dispatch('update_selector_pos', `top:${y}px;left:${x}px;`);
                });
            } else {
                this.$el.querySelector('.popup input').focus();
            }
        },
        pushNode(node){
            node.spawnPosition = {...this.spawnPoint};
            this.nodes.push(node)
        },
        move(e){
            if(this.editing && !this.creatingNode){
                let t = this.links[this.activeLink];

                let offset = -18;
                if(this.connectToOutput){
                    offset = 18;
                }
                t.to = {x: e.clientX + offset, y: e.clientY, node: t.to.node };
                this.links[this.activeLink] = t;
                this.$forceUpdate();
                this.pass = false;
            }
        },
        edit(e, connectToOutput){
            if(!this.editing){
                this.connectToOutput = connectToOutput;
                this.startEditing(e);
            } else if(connectToOutput == !this.connectToOutput) {
                let t = this.links[this.activeLink];
                let targetNode = t.from.from;

                let fromId = t.from.inputId != undefined ? t.from.inputId : t.from.outputId;
                let fromIsInput = t.from.inputId != undefined;

                let toId = e.inputId != undefined ? e.inputId : e.outputId;
                let toIsInput = e.inputId != undefined;

                let firstIO = fromIsInput ? targetNode.getInput(fromId) : targetNode.getOutput(fromId);
                let secondIO = toIsInput ? e.node.getInput(toId) : e.node.getOutput(toId);

                if(targetNode.id == e.node.id
                    || (firstIO.type != secondIO.type && firstIO.type != '*' && secondIO.type != '*')){
                    this.stopEditingNow();
                    return;
                }
                if(firstIO.type == '*' || secondIO.type == '*'){
                    t.color = '#f5f5f5';
                }
                this.stopEditing(e);
            }
        },
        startEditing(e){
            if(this.editing || this.mode !== 'build') return;
            this.$store.dispatch('update_editing', true);
            const id = rd();
            this.activeLink = id;

            let color = (e.inputId != undefined ? e.node.getInput(e.inputId).color :
                (e.outputId != undefined ? e.node.getOutput(e.outputId).color : '#f5f5f5'));

            this.links[id] = {
                id, 
                from: {$el: e.$el, from: e.node, inputId: e.inputId, outputId: e.outputId}, 
                to: {x: e.x, y: e.y}, 
                color: color };
        },
        stopEditing(e){
            if(this.editing){
                this.$store.dispatch('update_editing', false);
                let t = this.links[this.activeLink];
                let targetNode = t.from.from;
                let inputId = t.from.inputId;
                t.to = {$el: e.$el, next: e.node, inputId: e.inputId, outputId: e.outputId};

                if(this.connections[e.node.id]){
                    this.connections[e.node.id].push(this.activeLink);
                } else {
                    this.connections[e.node.id] = [this.activeLink];
                }

                if(this.connections[targetNode.id]){
                    this.connections[targetNode.id].push(this.activeLink);
                } else {
                    this.connections[targetNode.id] = [this.activeLink];
                }

                this.links[t.id] = t;
                
                this.activeLink = -1;
                this.$store.dispatch('update_editing', false);
            }
        },
        stopEditingNow(){
            this.$store.dispatch('update_editing', false);
            this.$delete(this.links, this.activeLink);
            this.activeLink = -1;
        },
        stopEditingFuture(e){
            if(this.creatingNode) return;
            this.stopEditingNow();
        },
        onUpdate(e){
            let indexes = this.connections[e.node.id];
            if(indexes){
                indexes.forEach(index => {
                    let u = this.$refs['l' + index];
                    if(u && u[0]){
                        u[0].update();
                    }
                });
            }
        },
        removeLink(e, id){
            if(this.mode !== 'build') return;
            let link = this.links[id];
            this.connections[link.from.from.id] = this.connections[link.from.from.id].filter(s => s !== id);
            this.connections[link.to.next.id] = this.connections[link.to.next.id].filter(s => s !== id);
            this.$delete(this.links, id);
        },
        deleteNode(node){
            if(this.mode !== 'build') return;
            if(node.hasReference && /buildpack\/[a-zA-Z0-9_-]+:(input|output)/.test(node.reference)){
                alert('You cannot delete this node: This is a buildpack built-in node.');
                return;
            }
            let index = this.nodes.indexOf(node);
            let connectedNodes = this.connections[node.id];
            if(connectedNodes){
                connectedNodes.forEach(connectionId => {
                    let link = this.links[connectionId];
                    if(link && link.to){
                        let target = link.from.from.id == node.id ? link.to.next.id : link.from.from.id;
                        delete this.links[connectionId];
                        this.connections[target] = this.connections[target].filter(s => s !== connectionId);
                    }
                });
                delete this.connections[node.id];
            }
            if(this.activeLink != -1 && this.links[this.activeLink]){
                if(!!this.links[this.activeLink].from.from && this.links[this.activeLink].from.from.id === node.id){
                    this.stopEditingNow();
                }
            }
            this.$delete(this.nodes, index);
        },
        resetState(setup=true){
            if(this.showDebugBounds){
                this.$el.querySelector('.border').style['border-color'] = null;
            }
            this.nodes = [];
            this.links = {};
            this.connections = {};
            this.pass = false;
            this.mode = 'build';
            this.$store.dispatch('update_creating_node', false);
            this.$store.dispatch('update_editing', false);
            this.activeLink = -1;
            this.script_name = 'Untitled Script';
            this.blocks = [];
            if(setup) this.setupBuildpackBuiltins();
        },
        updateDictionnaries(){
            this.$store.dispatch('update_editing_dictionaries', false);
        },
        // IO Functions
        import(content){
            this.resetState(false);
            let rawNodes = content.nodes;
            let rawLinks = content.links;
            let useRelativeCoords = !!content.bounds;
            let buildpackName = content.buildpacks[0];
            let buildpack = new buildpacks[buildpackName]();
            this.$store.dispatch('update_buildpack', buildpack);
            this.buildpack.requiredDictionaries.forEach(id => {
                if(dictionaries[id]){
                    this.$store.dispatch('add_dictionary', dictionaries[id]);
                }
            });
            this.$store.dispatch('update_creating_node', false);
            this.setupBuildpackBuiltins();

            if(this.showDebugBounds) this.$el.querySelector('.border').style.outline = null;
            this.script_name = content.name;

            if(useRelativeCoords){
                this.bounds = content.bounds;
                content.bounds = this.recenterBounds();
                
                if(this.$store.state.show_debug_bounds){
                    this.renderBounds();
                }
            }

            this.nodes = rawNodes.map(rNode => {
                if(!this.allNodes[rNode['$']]){
                    throw new Error('Unable to import an unregistred node: ' + rNode['$'] + ' (Missing dictionary?)');
                }
                let node = new this.allNodes[rNode['$']](rNode.id, rNode.name);
                if(rNode.ref) node.setReference(rNode.ref);
                if(rNode.opts){
                    node._inputStates = rNode.opts;
                }
                if(useRelativeCoords){
                    node.spawnPosition = {x: Math.floor(content.bounds.x + content.bounds.w * rNode.relative_pos.x), 
                        y: Math.floor(content.bounds.y + content.bounds.h * rNode.relative_pos.y) };
                    //console.log('Calculated relative pos of',node.id,':',node.spawnPosition);
                } else {
                    node.spawnPosition = rNode.pos;
                }
                return node;
            });
            
            this.$nextTick(() => {
                rawLinks.forEach(rLink => {
                    let from = this.nodes.filter(n => n.id == rLink.from.nid)[0];
                    let to = this.nodes.filter(n => n.id == rLink.to.nid)[0];
                    let fromIO = rLink.from.iid !== undefined ? from.getInput(rLink.from.iid) : from.getOutput(rLink.from.oid);
                    let toIO = rLink.to.iid !== undefined ? to.getInput(rLink.to.iid) : to.getOutput(rLink.to.oid);

                    if(fromIO.type !== toIO.type && fromIO.type !== '*' && toIO.type !== '*'){
                        console.warn('Skipped link (id=' + rLink.id + ', from_id=' + from.id + ', to_id=' + to.id + '): type mismatch.');
                        return;
                    }

                    let color = fromIO.type === '*' || toIO.type === '*' ? '#f5f5f5' : fromIO.color;
                    let $from = this.$refs['n' + from.id][0];
                    let $to = this.$refs['n' + to.id][0];
                    let fromWay = rLink.from.iid !== undefined;
                    let toWay = rLink.to.iid !== undefined;
                    let $fromButton = $from.$refs[fromWay ? 'i' + rLink.from.iid : 'o' + rLink.from.oid][0];
                    let $toButton = $to.$refs[toWay ? 'i' + rLink.to.iid : 'o' + rLink.to.oid][0];

                    this.$set(this.links, rLink.id, {
                        id: rLink.id,
                        color,
                        from: {
                            $el: $fromButton,
                            from: from,
                            inputId: rLink.from.iid,
                            outputId: rLink.from.oid,
                        },
                    	to: {
                            $el: $toButton,
                        	next: to,
                            inputId: rLink.to.iid,
                            outputId: rLink.to.oid,
                        }
                    })
                    if(this.connections[from.id]){
                        this.connections[from.id].push(rLink.id);
                    } else {
                        this.connections[from.id] = [rLink.id];
                    }

                    if(this.connections[to.id]){
                        this.connections[to.id].push(rLink.id);
                    } else {
                        this.connections[to.id] = [rLink.id];
                    }
                });
            });
		},
		export(name, author, runContext=false){
            const dictionnaries = [];
            let rect = this.$el.getBoundingClientRect();
            let bounds = {x: rect.width, y: rect.height, w: 0, h: 0};

            this.nodes.forEach(node => {
                let dictionary = this.nodeManager.findOrigin(node.constructor.name);
                if(dictionnaries.indexOf(dictionary) == -1){
                    dictionnaries.push(dictionary);
                }

                let rect = this.$refs['n' + node.id][0].$el.getBoundingClientRect();
                bounds.x = Math.min(node.spawnPosition.x, bounds.x);
                bounds.y = Math.min(node.spawnPosition.y, bounds.y);
                bounds.w = Math.max(node.spawnPosition.x + rect.width, bounds.w);
                bounds.h = Math.max(node.spawnPosition.y + rect.height, bounds.h);
            });
            
            bounds.w = bounds.w - bounds.x;
            bounds.h = bounds.h - bounds.y;

            const computerName = os.hostname();
			let script = {
                dictionnaries,
                nodes: this.nodes.map(node => {
                    let obj =  {
                        $: node.constructor.name,
                        id: node.id,
                        name: node.name,
                        pos: node.spawnPosition,
                        relative_pos: {x: (node.spawnPosition.x - bounds.x) / bounds.w, y: (node.spawnPosition.y - bounds.y) / bounds.h}
                    }
                    if(node._isConstant) obj.opts = node.getOutputs();
                    if(node.hasReference) obj.ref = node.reference;
                    return obj
                }),
                links: Object.values(this.links).map(link => {
                    return {
                        id: link.id,
                        from: {
                            nid: link.from.from.id,
                            oid: link.from.outputId,
                            iid: link.from.inputId,
                        },
                        to: {
                            nid: link.to.next.id,
                            oid: link.to.outputId,
                            iid: link.to.inputId,
                        }
                    }
                })
            };

            if(!runContext){
                script = {
                    name: name,
                    author: author || computerName,
                    buildpacks: [this.buildpack.constructor.name],
                    bounds,
                    ...script
                };
            } else {
                script.bounds = bounds;
            }

            return script;
        },
        updateBounds(){
            const rect = this.$el.getBoundingClientRect();
            let bounds = {x: rect.width, y: rect.height, w: 0, h: 0};

            this.nodes.forEach(node => {
                let rect = this.$refs['n' + node.id][0].$el.getBoundingClientRect();
                bounds.x = Math.min(node.spawnPosition.x, bounds.x);
                bounds.y = Math.min(node.spawnPosition.y, bounds.y);
                bounds.w = Math.max(node.spawnPosition.x + rect.width, bounds.w);
                bounds.h = Math.max(node.spawnPosition.y + rect.height, bounds.h);
            });
            
            bounds.w = bounds.w - bounds.x;
            bounds.h = bounds.h - bounds.y;
            this.bounds = bounds;
            this.renderBounds();
        },
        recenterBounds(){
            let rect = this.$el.getBoundingClientRect();
            let middleX = rect.width / 2 - this.bounds.w / 2, middleY = rect.height / 2 - this.bounds.h / 2;
            this.bounds.x = Math.max(middleX, 5);
            this.bounds.y = Math.max(middleY, 5);
            return this.bounds;
        },
        renderBounds(){
            if(!this.showDebugBounds) return;
            const $box = this.$el.querySelector('.border');
            $box.style.top = (this.bounds.y - 3)+ 'px';
            $box.style.left = (this.bounds.x - 3) + 'px';
            $box.style.width = (this.bounds.w + 6) + 'px';
            $box.style.height = (this.bounds.h + 6) + 'px';
            $box.style['border-color'] = 'orange';
        },
        setupBuildpackBuiltins(){
            const rect = this.$el.getBoundingClientRect();
            const iX = Math.round(rect.width * 0.05), dY = Math.round(rect.height * 0.05);

            this.$store.dispatch('reset_dictionnaries');
            this.buildpack.requiredDictionaries.forEach(id => {
                if(dictionaries[id]){
                    this.$store.dispatch('add_dictionary', dictionaries[id]);
                }
            });

            this.buildpack._requiredBlocks.forEach((block, i) => {
                this.blocks.push({name: block, color: 'orange', x: 200 + i * 100, y: 200});
            });
            
            const iRef = 'buildpack/' + this.buildpack.name + ':input';
            this.buildpack.requiredInputNodes.forEach((node_constructor, i) => {
                if(!this.allNodes[node_constructor]){
                    throw new Error('Unable to import an unregistred node: ' + node_constructor + ' (Missing dictionary?)');
                }
                let node = new this.allNodes[node_constructor](rd());
                node.setReference(iRef+i);
                node.spawnPosition = { x: iX, y: dY + (dY + 5) * i};
                this.nodes.push(node);
            });

            const oRef = 'buildpack/' + this.buildpack.name + ':output';
            const oX = Math.round(rect.width * 0.95);
            this.buildpack.requiredOutputNodes.forEach((node_constructor, i) => {
                if(!this.allNodes[node_constructor]){
                    throw new Error('Unable to import an unregistred node: ' + node_constructor + ' (Missing dictionary?)');
                }
                let node = new this.allNodes[node_constructor](rd());
                node.setReference(oRef+i);
                node.spawnPosition = { x: oX - node.width.slice(0,-2), y: dY + (dY + 5) * i};
                this.nodes.push(node);
            });
        },
        closeProfiles(){
            this.$store.dispatch('update_show_run_profiles', false);
        }
    },
    computed: {
        allNodesKeyed(){
            let n = [];
            Object.keys(this.nodeDict).forEach(category => Object.keys(this.nodeDict[category]).forEach(node => n.push(node)));
            return n;
        },
        allNodes(){
            let n = {};
            Object.keys(this.nodeDict).forEach(category => n = {...n, ...this.nodeDict[category]});
            return n;
        },
        ...mapGetters([ 'nodeManager', 'nodeDict', 'creatingNode', 'editing', 'buildpack', 'showDebugBounds', 'showRunProfiles' ])
    }
}
</script>

<style lang="scss">
    .space {
        overflow: hidden;
        width: 100vw;
        height: 100vh;
        position: absolute;
        z-index: 100;

        .button {
            padding: 10px 20px;
            border: 1px solid #131313;
            color: #d6d6d6;
            background: #424242;
            border-radius: 4px;
            box-shadow: 0 0 8px 0px rgba(0,0,0,.05);
            outline: none;
            cursor: pointer;

            .hover {
                display: none;
            }
            
            &:hover {
                box-shadow: 0 0 0 1px #4f98ca;

                .standby {
                    display: none;
                }

                .hover {
                    display: initial;
                }
            }

            &:focus {
                box-shadow: 0 0 0 1px #c9a66f;
            }

            &.dark {
                border: 1px solid #333333;
                background: #131313;
            }

            &.small {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 3px;
                width: 32px;
                height: 32px;
            }
        }

        .main {
            .input {
                width: 100%;
                margin-bottom: 5px;
            }
        }

        .toolbar {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            border-bottom: 1px solid #333333;

            button {
                border: none;
                background: transparent;
                color: #f5f5f5;
                padding: 3px;
                width: 30px;
                height: 30px;

                &:hover {
                    background: #575757;
                }
            }
        }

        ul.list {
            list-style: none;
            display: flex;
            flex-flow: column nowrap;
            margin-bottom: 15px;

            li.item {
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                cursor: pointer;
                color: #e6e6e6;
                padding: 3px;

                .icon {
                    padding: 5px;
                    height: 34px;
                    width: 34px;
                    color: #f5f5f5;
                }

                p {
                    color: #bebebe;
                    font-size: 14px;
                }

                &:not(:last-child){
                    border-bottom: none;
                }

                &:hover {
                    background: #575757;
                }
            }
        }

        .border {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            border: 1px solid transparent;

            .label {
                pointer-events: all;
                border: none;
                background: orange;
                outline: none;
                width: fit-content;
                padding: 3px;
                font-size: 12px;
                position: absolute;
                top: -24px;
                left: -1px;
                color: #333333;
            }
        }
    }
</style>