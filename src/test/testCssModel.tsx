import { defineComponent } from 'vue'
import classes from '@/style/test.module.scss'
export default defineComponent({
  setup() {
    console.log('css--model', classes)

    return () => {
      return <div class={`root  ${classes.moduleClass}`}>测试css-modules</div>
    }
  }
})