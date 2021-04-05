<template>
    <Dialog :visible="showBuildpacks" @close="$emit('close')" class="buildpacks-dialog">
        <div slot="body" class="rows v">
            <h3>New project</h3>
            <div class="cols">
                <transition name="swipe">
                    <div class="rows h" v-if="page == 0">
                        <p class="details">Select the buildpack which your project will based on</p>
                        <div class="grid">
                            <div class="buildpack" v-for="buildpack in buildpacks" :key="buildpack.id" :style="styleFor(buildpack)"
                                @click="select(buildpack)">
                                {{ buildpack.name }}
                                <p>{{ buildpack.buildpackVersion }}</p>
                            </div>
                            <div class="buildpack" @click="select({name: 'import'})">
                                Import file
                                <p>JSON File</p>
                            </div>
                        </div>
                    </div>
                </transition>
                <transition>
                    <div class="rows" v-if="page == 1">
                        <div class="field rows">
                            Script Name
                            <input class="input" type="text" v-model="script_name">
                        </div>
                        <div class="type" :style="styleFor(selectedBuildpack)">
                            {{ selectedBuildpack.name }}
                        </div>
                    </div>
                </transition>  
            </div>
        </div>
        <div slot="footer" v-if="page == 1">
            <button class="button" @click="$emit('close')">Cancel</button>
            <button class="button" @click="$emit('done', {selectedBuildpack, script_name})">Create</button>
        </div>
    </Dialog>
</template>

<script>
import Dialog from './../Dialog'
import { mapGetters } from 'vuex'

export default {
    components: { Dialog },
    data(){
        return {
            page: 0,
            selectedBuildpack: null,
            script_name: 'Untitled script'
        }
    },
    watch: {
        showBuildpacks(v){
            if(!v){
                this.page = 0;
                this.selectedBuildpack = null;
                this.script_name = 'Untitled script';
            }
        }
    },
    methods: {
        styleFor(buildpack){
            return `color:${buildpack.buildpackAccentColor};background-color:${buildpack.buildpackColor};`;
        },
        select(buildpack){
            this.selectedBuildpack = buildpack;
            if(buildpack.name === 'import'){
                this.$emit('done', {selectedBuildpack: this.selectedBuildpack});
                return;
            }
            this.page = 1;
        }
    },
    computed: {
        ...mapGetters(['buildpacks', 'nodeManager', 'showBuildpacks'])
    }
}
</script>

<style lang="scss">
.buildpacks-dialog {
    overflow: hidden;

    p.details {
        font-size: 14px;
        color: #ebebeb; 
        margin-bottom: 12px;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(2,150px);
    }

    .input {
        border-radius: 4px;
    }

    .buildpack {
        display: flex;
        flex-flow: column wrap;
        width: 140px;
        height: 90px;
        position: relative;
        margin: 5px;
        font-size: 18px;
        font-weight: bold;
        align-items: center;
        justify-content: center;
        padding-top: 8px;
        border: 1px solid transparent;
        user-select: none;
        cursor: pointer;

        background: rgba(201, 201, 201, .16);
        border-radius: 8px;

        &:before {
            content: '';
            background-color: currentColor;
            border-radius: 0 0 8px 8px;
            position: absolute;
            top: 0;
            left: 20px;
            right: 20px;
            height: 6px;
        }

        p {
            font-size: 14px;
            opacity: 0.9;
            font-weight: normal;
        }

        &:hover {
            border-color: currentColor;
        }
    }

    .rows {
        display: flex;
        flex-flow: column;

        &.h {
            align-items: center;
        }

        &.v {
            justify-content: center;
        }
    }

    .field {
        color: #b3b3b3;

        input {
            margin-top: 5px;
        }
    }

    .type {
        padding: 5px 12px;
        border-radius: 4px;
        font-size: 14px;
        background: rgba(201, 201, 201, .16);
    }

    .cols {
        display: flex;
        flex-flow: row;
    } 
    
    .sswipe-leave-active {        
        animation: slide-out 3s linear;
    }

    .slide-enter-active {
        animation: slide-in 3s linear;
    }

    .slide-enter-to {
    }
    
    .slide-leave-to {
    }

    @keyframes slide-out {
        0% {
            height: 100%;
            transform: translateX(0);
        }

        100% {
            height: 0;
            transform: translateX(-120%);
        }
    }

    @keyframes slide-in {
        0% {
            transform: translateX(-120%);
        }

        100% {
            transform: translateX(0);
        }
    }
}
</style>