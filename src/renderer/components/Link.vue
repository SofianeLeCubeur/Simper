<template>
  <div class="link" 
    @click.stop="focus" 
    @keyup.delete="$emit('clicked', $event)" 
    tabindex="0" 
    :style="`color:${color};`"
    :class="{locked: lock, edited: editing}">
      <div class="join" :style="startJoin"></div>
      <div class="join line" :style="style"></div>
      <div class="join" :style="endJoin"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    props: { from: { type: Object }, to: { type: Object }, color: { type: String }, lock: { type: Boolean }, id: { required: true } },
    data(){
        return {
            style: '',
            startJoin: '',
            endJoin: ''
        }
    },
    mounted(){
        this.update();
    },
    watch: {
        from(){
            this.update();
        },
        to(){
            this.update();
        },
        color(){
            this.update();
        }
    },
    methods: {
        focus(e){

        },
        update(){
            if(!this.$el.parentElement){
                console.warn('Skipping rendering (no parent element detected) of link #' + this.id + '.');
                return;
            }
            const isReversed = this.from.inputId != undefined;
            let sx = this.from.x;
            let sy = this.from.y;
            let tx = this.to.x;
            let ty = this.to.y;
            if(this.from.$el){
                let bd = this.from.$el.getBoundingClientRect();
                sx = bd.x + bd.width / 2 + (isReversed ? -16 : 16);
                sy = bd.y + bd.height / 2 - 2;
            }
            if(this.to.$el){
                let bd = this.to.$el.getBoundingClientRect();
                tx = bd.x + bd.width / 2 + (isReversed ? 16 : -16);
                ty = bd.y + bd.height / 2 - 2;
            }
            sx += this.$el.parentElement.scrollLeft;
            sy += this.$el.parentElement.scrollTop;
            tx += this.$el.parentElement.scrollLeft;
            ty += this.$el.parentElement.scrollTop;
            let dx = tx - sx;
            let dy = ty - sy;
            let width = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
            let angle = Math.atan2(dy, dx);
            this.style = `width:${width}px;top:${sy}px;left:${sx}px;transform:rotate(${angle}rad);`;
            if(isReversed){
                this.endJoin = `top:${ty}px;left:${tx - 16}px;`;
                this.startJoin = `top:${sy}px;left:${sx - 2}px;`;
            } else {
                this.endJoin = `top:${ty}px;left:${tx - 2}px;`;
                this.startJoin = `top:${sy}px;left:${sx - 16}px;`;
            }
        }
    },
    computed: {
        ...mapGetters([ 'editing' ])
    }
}
</script>

<style lang="scss">
    .link {
        .join {
            position: absolute;
            width: 18px;
            height: 4px;
            background: currentColor;
            border-radius: 4px;
            pointer-events: none;
            transform-origin: left;
            z-index: 200;

            &.line {
                height: 4px;
                border-radius: 8px;
                z-index: -1;
                pointer-events: all;
            }
        }

        &:not(.edited){
            &:hover .join {
                background: #bdbdbd;
                z-index: 210;
            }

            &:focus .join {
                background: #ffffff;
                z-index: 211;
            }
        }

        &.edited {
            pointer-events: none;
        }

        &.locked .join {
            opacity: 0.5;
        }
    }
</style>