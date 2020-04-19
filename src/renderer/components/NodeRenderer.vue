<template>
    <div class="node" :style="`width:${node.width}`" 
        @mousedown="dragStart" @mouseup="dragEnd" @click.stop="$emit('click', $event)"
        tabindex="0" @keyup.delete="deleteNode"
        :class="{compact: node.isInput, running: (!node.isInput || node._isConstant) && lock, lock: lock}">
        <div class="header">
            <div class="title" v-if="!node.isInput">
                {{ node.name }}
                <p class="def">{{ node.definition }}</p>
            </div>
            
            <div class="body">
                <div v-if="node.isInput" class="input">
                    <div v-for="inp in node.inputs" :key="inp.id" class="entry">
                        <p class="large" :class="{sliced: node._inputType === 'disabled'}">{{ inp.name }}</p>
                        <template v-if="node._inputType !== 'disabled'">
                            <input 
                            :type="node._inputType" 
                            placeholder="Value" 
                            :ref="`in${inp.id}`"
                            v-if="!node.var" 
                            :disabled="node._isConstant && lock || !node._isConstant && !lock"
                            @mousedown.stop
                            @keyup.delete.stop 
                            @click.stop>
                        </template>
                    </div>
                </div>
                <div class="inputs" v-else>
                    <div class="input" v-for="inp in node.inputs" :key="inp.id">
                        <button drag-target :style="`color:${node.getInput(inp.id).color}`" class="target" :class="{active: activeIO[inp.id]}"
                            @mousedown.stop @mouse.up.stop @click="input($event, inp.id)" :ref="`i${inp.id}`"></button>
                        <p class="label">{{ inp.name }}</p>
                    </div>
                </div>
                <div class="outputs">
                     <div class="output" v-for="out in node.outputs" :key="out.id">
                        <p class="label">{{ out.name }}</p>
                        <button drag-target :style="`color:${node.getOutput(out.id).color}`" class="target" :class="{active: activeIO[out.id]}"
                            @mousedown.stop @mouse.up.stop @click="output($event, out.id)" :ref="`o${out.id}`"></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="preview" v-if="node._hasPreview">
            <canvas :ref="'preview'"></canvas>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    props: { lock: { type: Boolean }, node: { type: Object, required: true }, activeIO: { type: Array }  },
    data(){
        return {
            active: false,
            currentX: 0,
            currentY: 0,
            initialX: 0,
            initialY: 0,
            xOffset: 0,
            yOffset: 0,
            values: {}
        }
    },
    created(){
        if(this.node.isInput){
            this.node.setGenerator((_, outputs) => {
                let inputs = {};
                if(this.node._inputType !== 'disabled'){
                    this.node.inputs.forEach(inp => inputs[inp.id] = this.$refs['in' + inp.id][0].value);
                }
                outputs[0] = this.node._inputAssign(inputs);
            });
        }
    },
    mounted(){
        if(this.node._isConstant){
            let inputs = {};
            this.node.inputs.forEach(inp => this.$refs['in' + inp.id][0].value = this.node.getInputState(inp.id));
        }

        if(this.node.spawnPosition){
            this.currentX = this.node.spawnPosition.x;
            this.currentY = this.node.spawnPosition.y;
            this.initialX = this.currentX;
            this.initialY = this.currentY;
            this.xOffset = this.currentX;
            this.yOffset = this.currentY;
            this.$el.style.transform = "translate3d(" + this.currentX + "px, " + this.currentY + "px, 0)";
        }
        if(this.node._hasPreview){
            const canvas = this.$refs['preview'];
            canvas.width = this.node.width.replace('px', '') - 2;
            canvas.height = this.node.width.replace('px', '') - 2;
            const ctx = canvas.getContext('2d');
            this.node._preview = canvas;
            this.$nextTick(() => this.node._previewRenderer(ctx, canvas));
            // TODO
        }

        document.addEventListener('mousemove', this.drag);
    },
    destroyed(){
        document.removeEventListener('mousemove', this.drag);
    },
    methods: {
        deleteNode(){
            this.$emit('delete');
        },
        updatePos(newPos){
            this.currentX = newPos.x;
            this.currentY = newPos.y;
            this.initialX = this.currentX;
            this.initialY = this.currentY;
            this.xOffset = this.currentX;
            this.yOffset = this.currentY;
            this.$el.style.transform = "translate3d(" + this.currentX + "px, " + this.currentY + "px, 0)";
            this.$emit('update', {node: this.node});
        },
        dragStart(e) {
            if(this.lock) return;
            if (e.type === "touchstart") {
                this.initialX = e.touches[0].clientX - this.xOffset;
                this.initialY = e.touches[0].clientY - this.yOffset;
            } else {
                this.initialX = e.clientX - this.xOffset;
                this.initialY = e.clientY - this.yOffset;
            }

            if (this.$el.contains(e.target)) {
                this.active = true;
                this.$el.classList.add('grabbed');
            }
        },
        dragEnd(e) {
            this.initialX = this.currentX;
            this.initialY = this.currentY;

            this.active = false;
            this.$el.classList.remove('grabbed');
            this.$emit('updateEnd');
        },
        drag(e) {
            if(this.lock) return;
            if (this.active) {
                e.preventDefault();
            
                if (e.type === "touchmove") {
                    this.currentX = e.touches[0].clientX - this.initialX;
                    this.currentY = e.touches[0].clientY - this.initialY;
                } else {
                    this.currentX = e.clientX - this.initialX;
                    this.currentY = e.clientY - this.initialY;
                }

                this.xOffset = this.currentX;
                this.yOffset = this.currentY;

                this.node.spawnPosition = {x: this.currentX, y: this.currentY};
                this.$el.style.transform = "translate3d(" + this.currentX + "px, " + this.currentY + "px, 0)";
                this.$emit('update', {node: this.node});
            }
        },
        input(e, id){
            this.$emit('link', {$el: e.target, x: e.clientX, y: e.clientY, node: this.node, inputId: id});
        },
        output(e, id){
            this.$emit('out', {$el: e.target, node: this.node, outputId: id});
        }
    }
}
</script>

<style lang="scss">
    $nodeBackground: #424242;
    $nodeBorder: #131313;
    $nodePanel: #383838;
    $nodeForeground: #d6d6d6;
    $hoverBorder: #4f98ca;
    $focusBorder: #c9a66f;

    .node {
        display: flex;
        flex-flow: column nowrap;
        border-radius: 4px;
        border: 1px solid $nodeBorder;
        box-shadow: 0 0 8px 0px rgba(0,0,0,.05);
        width: 190px;
        user-select: none;
        z-index: 100;
        overflow: hidden;
        outline: none;
        position: absolute;
        opacity: 0.95;

        .preview {
            display: flex;
        }

        &:hover {
            box-shadow: 0 0 0 1px $hoverBorder;
        }

        &:focus {
            box-shadow: 0 0 0 1px $focusBorder;
        }

        &.grabbed {
            z-index: 500;

            .header {
                cursor: grabbing;
                cursor: -webkit-grabbing;
            }
        }

        .header {
            display: flex;
            flex-flow: column nowrap;
            cursor: move;
            cursor: -webkit-grab;
            cursor: grab;

            .title {
                padding: 8px;
                background: $nodeBackground;
                color: $nodeForeground;
                border-bottom: 1px solid $nodeBorder;

                p.def {
                    font-size: 14px;
                    pointer-events: none;
                }
            }

            .body {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                background: $nodeBackground;
                
                .inputs, .outputs {
                    display: flex;
                    flex-flow: column nowrap;
                    padding: 5px;
                }

                .outputs {
                    background: $nodePanel;
                    border-left: 1px solid $nodeBorder;
                }

                .output {
                    justify-content: flex-end;
                }

                .input {
                    justify-content: flex-start;
                }

                .input, .output {
                    display: flex;
                    flex-flow: row nowrap;
                    position: relative;
                    align-items: center;
                    padding: 3px 0;

                    p {
                        color: $nodeForeground;
                    }

                    input {
                        border: none;
                        background: transparent;
                        width: 60px;
                        outline: none;
                        color: $nodeForeground;
                        padding: 5px;
                        font-size: 16px;
                        &::-webkit-outer-spin-button,
                            &::-webkit-inner-spin-button {
                            -webkit-appearance: none;
                            margin: 0;
                        }

                        &[disabled] {
                            cursor: not-allowed;
                        }
                    }
                    
                    input[type=checkbox] {
                        width: fit-content;
                        margin: 8px;
                    }
                }

                .target {
                    border: none;
                    height: 10px;
                    width: 10px;
                    border-radius: 50%;
                    outline: none;
                    border: 1px solid currentColor;
                    background: transparent;
                    color: $nodeForeground;
                    background: #333333;

                    &:hover {
                        background: #333333;
                    }

                    &.active {
                        background: currentColor;
                    }
                }

                .label {
                    padding: 0 5px;
                    color: $nodeForeground;
                }
            }
        }

        &.compact {
            width: fit-content;

            .input {
                padding: 0 !important;

                .entry {
                    display: flex;
                    flex-flow: row nowrap;

                    &:first-child p.large {
                        border-left: none;
                    }
                }

                p.large {
                    display: flex;
                    justify-content: center;
                    background: $nodePanel;
                    border-left: 1px solid $nodeBorder;
                    border-right: 1px solid $nodeBorder;
                    padding: 3px 5px;
                    align-items: center;

                    &.sliced {
                        border-right: none;
                    }
                }
            }

            .outputs {
                justify-content: center;

                .label {
                    display: none;
                }
            }
        }

        &.lock .header {
            cursor: initial;
        }
        
        &.running {
            opacity: 0.5;
            box-shadow: none;
        }
    }
</style>