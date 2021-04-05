<template>
    <Dialog :visible="visible" @close="$emit('close')" class="dict-dialog">
        <div slot="body">
            <h3>Dictionnaries</h3>
            <ul class="list" v-if="nodeManager != null">
                <li v-for="(dictionnary, name) in dictionnaries" :key="name" class="item" @click="toggle(name)">
                    <div class="folder">
                        <div class="container">
                            <div class="icon">
                                <template v-if="dictionnary.icon && dictionnary.icon.type === 'svg'">
                                    <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                                        <path fill="currentColor" :d="dictionnary.icon.path" />
                                    </svg>
                                </template>
                                <template v-else-if="dictionnary.icon && dictionnary.icon.type === 'url'">
                                    <img :src="dictionnary.icon.url">
                                </template>
                            </div>
                        </div>
                        <transition name="slide">
                            <div class="badge cyan" v-if="!!overrides[name]">
                                <svg style="width:20px;height:20px" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                                </svg>
                            </div>
                        </transition>
                        <div class="badge pink" v-if="isRequired(dictionnary)">*</div>
                    </div>
                    <div class="content">
                        {{ name }}
                        <p>{{ dictionnary.description }}</p>
                    </div>
                </li>
            </ul>
        </div>
        <div slot="footer">
            <button class="button" @click="$emit('close')">Cancel</button>
            <button class="button">Save</button>
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
            overrides: {}
        }
    },
    mounted(){
        let dictionnaries = this.nodeManager.list();
        Object.keys(dictionnaries).forEach(name => {
            this.overrides[name] = true;
        });
    },
    methods: {
        toggle(name){
            this.$set(this.overrides, name, !this.overrides[name]);
        },
        isRequired(dictionnary){
            if(!this.buildpack) return false;
            return this.buildpack._requiredDictionaries.indexOf(dictionnary.id) >= 0;
        }
    },
    computed: {
        ...mapGetters({ buildpack: 'buildpack', buildpacks: 'buildpacks', 
        dictionnaries: 'dictionnaries', nodeManager: 'nodeManager', visible: 'editingDictionaries' })
    }
}
</script>

<style lang="scss">
@import '../../assets/ffolders.scss';
.dict-dialog {
    ul.list {
        list-style: none;
        display: flex;
        flex-flow: column nowrap;
        margin-bottom: 15px;
        max-height: 400px;

        li.item {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            cursor: pointer;
            color: #e6e6e6;
            margin: 8px 0;

            .folder {
                margin: 0 12px;
                @include ffolder(64px, $yellow);
                background-color: darken($yellow, 5%);
                $radius: floor((64px * 6.82)/100);

                .container {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    align-items: center;
                    justify-content: center;

                    &:before {
                        content: '';
                        position: absolute;
                        top: 4px;
                        bottom: 4px;
                        left: 4px;
                        right: 4px;
                        background: #ffffff;
                    }
                }
                
                .icon {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    z-index: 3;
                    border-radius: 0 $radius $radius $radius;
                    align-items: center;
                    justify-content: center;
                    background-color: $yellow;
                    transform-origin: 0 100%;
                    transition: transform .3s;
                }

                .badge {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: absolute;
                    top: -4px;
                    right: -4px;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    font-size: 22px;
                    z-index: 4;

                    &.pink {
                        background-color: #FF7F92;
                        color: darken(#FF7F92, 42%);
                        font-weight: bold;
                    }

                    &.cyan {
                        background-color: #23CBF4;
                        color: darken(#23CBF4, 25%);
                        font-weight: bold;
                    }
                }
            }

            &:hover .folder .icon {
                transform: rotateX(35deg);
            }

            p {
                color: #bebebe;
                 font-size: 14px;
            }

            &:not(:last-child){
                border-bottom: none;
            }
        }
    }

    .slide-enter-active, .slide-leave-active {
        transition: opacity .5s;
    }

    .slide-enter-active {
        opacity: 0;
    }

    .slide-enter-to {
        opacity: 1;
    }
    
    .slide-leave-to {
        opacity: 0;
    }
}
</style>