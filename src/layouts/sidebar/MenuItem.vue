<script lang="ts">
import { h } from 'vue'

const MenuItem = (props: any, context: any) => {
    const vnodes = []
    if (props.icon) {
        vnodes.push(h('div', { style: { backgroudColor: "red" } }))
    }
    if (props.title) {
        vnodes.push(h("span", props.title))
    }
    return vnodes
}

MenuItem.props = ['icon', 'title']

export default MenuItem
</script>