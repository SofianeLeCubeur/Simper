<template>
    <Dialog :visible="visible" @close="$emit('close')">
        <div slot="body">
            <h3>Enabled Dictionnaries</h3>
            <input type="text" placeholder="Search..." class="input">
            <ul class="list" v-if="nodeManager != null">
                <li v-for="(dictionnary, name) in nodeManager.list()" :key="name" class="item">
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
                    <div class="content">
                        {{ name }}
                        <p>{{ dictionnary.description }}</p>
                    </div>
                </li>
            </ul>
        </div>
        <div slot="footer">
        </div>
    </Dialog>
</template>

<script>
import Dialog from './../Dialog'
import { mapGetters } from 'vuex'

export default {
    components: { Dialog },
    computed: {
        ...mapGetters({nodeManager: 'nodeManager', visible: 'editingDictionaries' })
    }
}
</script>

<style>

</style>