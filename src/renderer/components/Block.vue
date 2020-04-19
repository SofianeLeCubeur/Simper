<template>
    <div class="block" :style="pos">
        <div class="label">{{ name }}</div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            name: '',
            drawOutline: true,
            outlineColor: 'orange'
        }
    },
    computed: {
        pos(){
            return `top:${this.x}px;left:${this.y}px;width:${this.width}px;height:${this.height}px`;
        }
    }
}
</script>

<style lang="scss">
    .block {
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
</style>