<template>
  <div class="dialog" :class="{visible: visible}" @click.stop>
      <div class="body">
            <div class="close" @click="$emit('close')">
                <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z" />
                </svg>
            </div>
            <div class="main">
                <slot name="body"></slot>
            </div>
            <div class="footer">
                <slot name="footer"></slot>
            </div>
      </div>
  </div>
</template>

<script>
export default {
    props: { visible: { type: Boolean } }
}
</script>

<style lang="scss">
    .dialog {
        display: none;
        align-items: center;
        justify-content: center;
        position: absolute;
        z-index: 500;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,.15);

        &.visible {
            display: flex;
        }

        .body {
            padding: 15px 20px;
            background: #424242;
            color: #ffffff;
            box-shadow: 0 0 8px 2px rgba(0,0,0,.2);
            position: relative;
            border-radius: 3px;

            .close {
                position: absolute;
                top: 5px;
                right: 5px;
                cursor: pointer;
            }

            h3 {
                padding: 5px 0 10px 0;
                text-align: center;
            }
        }
    }
</style>