<template>
<div class="console compact" v-if="!visible">
    <div class="header cols" @click.stop>
        <h2 class="cols">
            <div class="icon cols" @click="$emit('expand')">
                <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                </svg>
            </div>
            Console
        </h2>
        <div class="tag orange" title="Filtred number of lines">{{ lines.length - displayedLines(true).length }}</div>
        <div class="tag blue" title="Number of lines">{{ displayedLines(true).length }}</div>
    </div>
</div>
<div class="console" v-else>
    <div class="header cols" @click.stop>
        <h2 class="cols">
            <div class="icon cols" @click="$emit('reduce')">
                <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z" />
                </svg>
            </div>
            Console
        </h2>
        <div class="cols">
            <div class="checkbox" :class="{active: showDebugLines}" @click="showDebugLines = !showDebugLines">Show Debug</div>
            <button class="button dark small" @click="lines = []" title="Clear Console">
                <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M5,13H19V11H5M3,17H17V15H3M7,7V9H21V7" />
                </svg>
            </button>
        </div>
    </div>
    <div class="lines">
        <div class="line" v-for="line in displayedLines()" :key="line.timestamp*Math.random()">
            <div class="body">
                <p class="head">{{ line.initiator || line.tag ? `[${line.tag}]` : undefined }}</p>
                <p v-for="(style, part) in displayedContent(line)" :key="part" :style="style">
                    {{ part }}
                </p>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    props: { visible: { type: Boolean, default: true }},
    data(){
        return {
            lines: [],
            showDebugLines: false
        }
    },
    created(){
        console.printLog = (obj) => {
            this.lines.push({...obj, timestamp:Date.now()});
            console.log(obj.content, ...obj.$style);
            if(this.visible){
                this.$nextTick(() => {
                    const $el = this.$el.querySelector('.lines');
                    $el.scrollTop = $el.scrollHeight;
                });
            }
        };
    },
    methods: {
        displayedContent(line){
            let obj = {};
            line.content.split('%c').slice(1).forEach((p,i) => {
                obj[p] = line.$style[i]
            });
            return obj;
        },
        displayedLines(skip=false){
            return this.lines.filter(line => {
                if((!this.showDebugLines || skip) && line.tag === 'Debug'){
                    return false;
                }
                return true;
            });
        }
    }
}
</script>

<style lang="scss">
    .console {
        display: flex;
        flex-flow: column nowrap;
        border: 1px solid #131313;
        width: 380px;
        z-index: 500;
        position: fixed;
        top: 3px;
        left: 3px;
        bottom: 3px;
        background: rgba(39, 39, 39, 0.5);
        border-radius: 6px;
        box-shadow: 0 0 8px 2px rgba(0,0,0,.2);

        &.compact {
            width: fit-content;
            bottom: auto;
        }

        .tag {
            border-radius: 8px;
            padding: 3px;
            margin-left: 10px;

            &.blue {
                margin-left: 3px;
                background-color: #1596ef;
            }

            &.orange {
                background-color: #fd696b;
            }
        }

        .lines {
            max-height: 100%;
            overflow-y: auto;
        }

        div.checkbox {
            text-decoration: line-through;
            color: #cccccc;
            cursor: pointer;
            user-select: none;
            height: fit-content;
            margin: 0 5px;

            &.active {
                text-decoration: none;
                color: #f5f5f5;
            }
        }

        .cols {
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            align-items: center;
        }

        .header {
            padding: 5px;
            background: #131313;
            color: #f5f5f5;
            font-size: 14px;
            justify-content: space-between;
            
            h2 {
                height: fit-content;
                font-weight: normal;
                font-size: 16px;
                user-select: none;
            }

            .icon {
                cursor: pointer;
            }
        }

        .line {
            display: flex;
            flex-flow: row wrap;
            font-size: 14px;
            border-top: 1px solid #131313;

            .head {
                /*color: #eeeeee;*/
                color: #fd696b;
                font-weight: 600;
            }

            .body {
                display: flex;
                flex-flow: row wrap;
                width: 100%;

                p:not(:empty) {
                    flex-shrink: 0;
                    flex-grow: 0;
                    max-width: calc(100% - 6px);
                    padding: 3px;
                    overflow-wrap: break-word;
                }
            }

            &:first-child {
                border-top: none;
            }
        }
    }
</style>