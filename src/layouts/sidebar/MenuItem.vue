<script lang="ts">
import { h } from 'vue'

const MenuItem = (props, context) => {
    console.log(props, context)
    return h(`${props.icon} , ${props.title}`, context.attrs, context.slots)
}

MenuItem.props = ['icon', 'title']

export default MenuItem
</script>