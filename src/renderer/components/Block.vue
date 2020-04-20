<template>
    <div class="block" :style="{'top': x + 'px', 'left': y + 'px', 'width': width + 'px', 'height': height + 'px', 'color': color}" @click.stop>
        <!--<div class="label" @mousedown="dragStart" @mouseup="dragEnd">-->
        <div class="label">
            <p>{{ name }}</p>
        </div>
        <div class="resizers" @click.stop>
            <div class="resizer top-left"></div>
            <div class="resizer top-right"></div>
            <div class="resizer bottom-left"></div>
            <div class="resizer bottom-right"></div>
        </div>
        <slot></slot>
    </div>
</template>

<script>

function makeResizableDiv(element) {
  const resizers = element.querySelectorAll('.resizer')
  const minimum_size = 64;
  let original_width = 0;
  let original_height = 0;
  let original_x = 0;
  let original_y = 0;
  let original_mouse_x = 0;
  let original_mouse_y = 0;
  for (let i = 0;i < resizers.length; i++) {
    const currentResizer = resizers[i];
    currentResizer.addEventListener('mousedown', function(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
      original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
      original_x = element.getBoundingClientRect().left;
      original_y = element.getBoundingClientRect().top;
      original_mouse_x = e.pageX;
      original_mouse_y = e.pageY;
      window.addEventListener('mousemove', resize)
      window.addEventListener('mouseup', stopResize)
    })
    
    function resize(e) {
      if (currentResizer.classList.contains('bottom-right')) {
        const width = original_width + (e.pageX - original_mouse_x);
        const height = original_height + (e.pageY - original_mouse_y)
        if (width > minimum_size) {
          element.style.width = width + 'px'
        }
        if (height > minimum_size) {
          element.style.height = height + 'px'
        }
      }
      else if (currentResizer.classList.contains('bottom-left')) {
        const height = original_height + (e.pageY - original_mouse_y)
        const width = original_width - (e.pageX - original_mouse_x)
        if (height > minimum_size) {
          element.style.height = height + 'px'
        }
        if (width > minimum_size) {
          element.style.width = width + 'px'
          element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
        }
      }
      else if (currentResizer.classList.contains('top-right')) {
        const width = original_width + (e.pageX - original_mouse_x)
        const height = original_height - (e.pageY - original_mouse_y)
        if (width > minimum_size) {
          element.style.width = width + 'px'
        }
        if (height > minimum_size) {
          element.style.height = height + 'px'
          element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
        }
      }
      else {
        const width = original_width - (e.pageX - original_mouse_x)
        const height = original_height - (e.pageY - original_mouse_y)
        if (width > minimum_size) {
          element.style.width = width + 'px'
          element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
        }
        if (height > minimum_size) {
          element.style.height = height + 'px'
          element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
        }
      }
    }
    
    function stopResize() {
      window.removeEventListener('mousemove', resize)
    }
  }
}

export default {
    props: { block: { type: Object, required: true } },
    data(){
        return {
            x: 200,
            y: 200,
            width: 64,
            height: 64,
            initialX: 0,
            initialY: 0,
            xOffset: 0,
            yOffset: 0,
            active: false,
            name: 'Block',
            color: 'orange'
        }
    },
    mounted(){
        const resizers = this.$el.querySelectorAll('.resizer')
        this.x = this.block.x || this.x;
        this.y = this.block.y || this.y;
        this.width = this.block.width || this.width;
        this.height = this.block.height || this.height;
        this.name = this.block.name;
        this.color = this.block.color || this.color;

        makeResizableDiv(this.$el);
        /*this.initialX = this.x;
        this.initialY = this.y;
        this.xOffset = this.x;
        this.yOffset = this.y;
        document.addEventListener('mousemove', this.drag);*/
    },
    destroyed(){
        document.removeEventListener('mousemove', this.drag);
    },
    methods: {
        updatePos(newPos){
            this.x = newPos.x;
            this.y = newPos.y;
            this.initialX = this.x;
            this.initialY = this.y;
            this.xOffset = this.x;
            this.yOffset = this.y;
        },
        dragStart(e) {
            if (e.type === "touchstart") {
                this.initialX = e.touches[0].clientX - this.xOffset;
                this.initialY = e.touches[0].clientY - this.yOffset;
            } else {
                this.initialX = e.clientX - this.xOffset;
                this.initialY = e.clientY - this.yOffset;
            }

            if (this.$el.contains(e.target)) {
                this.active = true;
            }
        },
        dragEnd(e) {
            this.initialX = this.x;
            this.initialY = this.y;

            this.active = false;
            this.$emit('updateEnd');
        },
        drag(e) {
            if (this.active) {
                e.preventDefault();
            
                if (e.type === "touchmove") {
                    this.x = e.touches[0].clientX - this.initialX;
                    this.y = e.touches[0].clientY - this.initialY;
                } else {
                    this.x = e.clientX - this.initialX;
                    this.y = e.clientY - this.initialY;
                }

                this.xOffset = this.x;
                this.yOffset = this.y;
                console.log('move');
            }
        },
    },
    computed: {
        pos(){
            return `top:${this.x}px;left:${this.y}px;width:${this.width}px;height:${this.height}px;color:${this.color}`;
        }
    }
}
</script>

<style lang="scss">
    .block {
        display: flex;
        justify-content: center;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 1px solid currentColor;

        .label {
            pointer-events: all;
            border: none;
            background: currentColor;
            outline: none;
            width: fit-content;
            padding: 3px 5px;
            font-size: 12px;
            position: absolute;
            top: -24px;
            user-select: none;

            p {
                color: #333333;
            }
        }

        .resizers {
            pointer-events: none;

            .resizer {
                 width: 10px;
                height: 10px;
                border-radius: 50%; /*magic to turn square into circle*/
                background: currentColor;
                position: absolute;
                pointer-events: all;

                &.top-left {
                    left: -5px;
                    top: -5px;
                    cursor: nwse-resize; /*resizer cursor*/
                }

                &.top-right {
                    right: -5px;
                    top: -5px;
                    cursor: nesw-resize;
                }

                &.bottom-left {
                    left: -5px;
                    bottom: -5px;
                    cursor: nesw-resize;
                }

                &.bottom-right {
                    right: -5px;
                    bottom: -5px;
                    cursor: nwse-resize;
                }
            }
        }
    }
</style>