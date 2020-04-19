<template>
    <Dialog :visible="visible" @close="$emit('close')" class="run_with">
        <div slot="body">
            <div class="header">
                <h2>Run with...</h2>
                <p>Using <strong>{{ `${buildpack._name}@${buildpack._version}` }}</strong> as buildpack</p>
            </div>
            <div class="cols">
                <div class="panel small">
                    <div class="toolbar">
                        <button class="item green" title="Create Profile" @click="createProfile">
                            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
                            </svg>
                        </button>
                        <button class="item red" title="Delete Profile" :disabled="!profiles[activeProfile]" @click="deleteProfile">
                            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M19,13H5V11H19V13Z" />
                            </svg>
                        </button>
                        <button class="item blue" titl="Import">
                            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
                            </svg>
                        </button>
                        <button class="item orange" title="Export">
                            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" />
                            </svg>
                        </button>
                        <button class="item yellow" title="Duplicate" @click="duplicateProfile">
                            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" />
                            </svg>
                        </button>
                    </div>
                    <ul>
                        <li v-for="(profile,i) in profiles" 
                            :key="i" 
                            @click="changeProfile(i)"
                            @key.enter="changeProfile(i)"
                            tabindex="0"
                            :class="{active: activeProfile === i}">
                        {{ profile.name }}</li>
                    </ul>
                </div>
                <div class="panel" :class="{disabled: !selectedProfile}">
                    <div class="field">
                        <label>Name</label>
                        <input class="input" type="text" v-if="selectedProfile" v-model="selectedProfile.name" />
                        <input v-else class="input" type="text">
                    </div>
                    <p class="seperator">Run Settings</p>
                    <div class="field">
                        <label>Run Context</label>
                        <select class="input">
                            <option selected>Volatile</option>
                            <option>Export</option>
                            <option>Debug (Step by Step)</option>
                        </select>
                    </div>
                    <div class="field">
                        <label>Runs</label>
                        <input type="number" v-model="runs" class="input">
                    </div>
                    <p class="seperator">Export Settings</p>
                    <div class="field">
                        <label>Export Format</label>
                        <select class="input">
                            <option>Logs (Text)</option>
                            <option selected>Logs (JSON)</option>
                            <option>Results only (Text)</option>
                            <option>Results only (JSON)</option>
                            <option>Full context (Text)</option>
                            <option>Full context (JSON)</option>
                        </select>
                    </div>
                    <div class="field">
                        <label>Log Filter</label>
                        <div class="input controls">
                            <input type="text" placeholder="Pattern..." class="debug">
                            <div class="type" title="Exact Match">
                                <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M11.14 4L6.43 16H8.36L9.32 13.43H14.67L15.64 16H17.57L12.86 4M12 6.29L14.03 11.71H9.96M20 14V18H4V15H2V20H22V14Z" />
                                </svg>
                            </div>
                            <div class="type" title="Regex">
                                <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M16,16.92C15.67,16.97 15.34,17 15,17C14.66,17 14.33,16.97 14,16.92V13.41L11.5,15.89C11,15.5 10.5,15 10.11,14.5L12.59,12H9.08C9.03,11.67 9,11.34 9,11C9,10.66 9.03,10.33 9.08,10H12.59L10.11,7.5C10.3,7.25 10.5,7 10.76,6.76V6.76C11,6.5 11.25,6.3 11.5,6.11L14,8.59V5.08C14.33,5.03 14.66,5 15,5C15.34,5 15.67,5.03 16,5.08V8.59L18.5,6.11C19,6.5 19.5,7 19.89,7.5L17.41,10H20.92C20.97,10.33 21,10.66 21,11C21,11.34 20.97,11.67 20.92,12H17.41L19.89,14.5C19.7,14.75 19.5,15 19.24,15.24V15.24C19,15.5 18.75,15.7 18.5,15.89L16,13.41V16.92H16V16.92M5,19A2,2 0 0,1 7,17A2,2 0 0,1 9,19A2,2 0 0,1 7,21A2,2 0 0,1 5,19H5Z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div slot="footer">
            <button class="button">Run</button>
            <button class="button" @click="$emit('close')">Cancel</button>
            <button class="button">Save</button>
        </div>
    </Dialog>
</template>

<script>
import Dialog from './../Dialog'
import { mapGetters } from 'vuex'

export default {
    props: { visible: { type: Boolean }},
    components: { Dialog },
    data(){
        return { 
            runs: 1,
            profiles: [],
            activeProfile: -1
        }
    },
    methods: {
        createProfile(){
            this.profiles.push({name: 'Run Profile'});
        },
        deleteProfile(){
            this.profiles.splice(this.activeProfile,1);
            this.activeProfile = this.activeProfile-1;
        },
        changeProfile(newProfile){
            if(this.canChange){
                this.activeProfile = newProfile
            }
        },
        duplicateProfile(){
            if(this.selectedProfile){
                this.profiles.splice(this.activeProfile+1, 0, {...this.selectedProfile,name: 'Copy of ' + this.selectedProfile.name});
            }
        }
    },
    computed: {
        ...mapGetters(['nodeManager', 'buildpack']),
        canChange(){
            if(this.selectedProfile){
                let p = this.selectedProfile;
                return p.name && p.name.trim().length > 0 && p.name.trim().length < 26
            }
            return true;
        },
        selectedProfile(){
            return this.profiles[this.activeProfile]
        }
    }
}
</script>

<style lang="scss">
    .run_with {
        p {
            font-size: 14px;
            color: #bfbfbf;
        }

        select.button {
            padding: 5px !important;
            background: #383838;
        }

        .cols {
            display: flex;
            flex-flow: row nowrap;
        }

        .toolbar {
            background: #383838;
            border-bottom-color: #272727 !important;
        }

        .panel {
            margin: 0 5px;
            border: 1px solid #272727;
            padding: 5px;
            user-select: none;

            &.disabled {
                opacity: 0.5;
                pointer-events: none;
            }

            ul {
                list-style-type: none;
                display: flex;
                flex-flow: column;

                li {
                    padding: 5px;
                    cursor: pointer;
                    outline: none;

                    &:hover {
                        background: #383838;
                    }

                    &.active {
                        background: #252525;
                    }
                }
            }

            .item {
                display: flex;
                align-items: center;
                width: fit-content;
                padding: 0 3px;
                border: none;    
                outline: none;       

                &:hover {
                    background: #272727;
                }

                &.green {
                    color: #50d890;
                }

                &.red {
                    color: #f95959;
                }

                &.orange {
                    color: #ff8364;
                }

                &.yellow {
                    color: #ffb677;
                }

                &.blue {
                    color: #3fc5f0;
                }

                &[disabled] {
                    opacity: 0.5;

                    &:hover {
                        background: transparent;
                    }
                }
            }

            &.small {
                padding: 0;
            }
        }

        .field {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            justify-content: space-between;
            padding: 5px;

            label {
                font-size: 14px;
                flex-grow: 0;
                flex-shrink: 0;
                margin: 10px;
            }

            .button {
                margin: 5px;
            }
        }

        .header {
            margin-bottom: 20px;
            padding: 0 10px;
        }

        .input {
            border: 1px solid #131313;
            background: #383838;
            color: #f3f3f3;
            padding: 5px 8px;
            font-size: 14px;
            border-radius: 4px;
            outline: none;
            margin: 0;
            width: auto !important;
            margin-bottom: 0px !important;

            &:hover {
                box-shadow: 0 0 0 1px #4f98ca;
            }

            &:focus, &:focus-within {
                box-shadow: 0 0 0 1px #c9a66f;
            }

            &.controls {
                display: flex;
                flex-flow: row nowrap;
                padding: 0;

                input {
                    color: #f3f3f3;
                    padding: 5px 0 5px 8px;
                    font-size: 16px;
                    border: none;
                    background: transparent;
                    outline: none;
                    max-width: 150px;
                }

                .type {
                    display: flex;
                    align-items: center;
                    width: fit-content;
                    padding: 0 3px;               

                    &:hover {
                        background: #272727;
                    }
                }
            }
        }
    }
</style>