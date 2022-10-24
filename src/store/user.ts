import { defineStore } from 'pinia'
import { useAppStore } from './app'

export const useUserStore = defineStore({
  id: 'user',
  state: () => {
    return {
      name: '张三',
      age: 18
    }
  },
  getters: {
    fullName: (state) => {
      return state.name + '丰'
    }
  },
  actions: {
    updateState(data: any) {
      this.$state = data
      console.log(this.$state, 'this.$state')
      this.updateAppConfig()
    },
    updateAppConfig() {
      const appStore = useAppStore()
      console.log(appStore, 'appStore')
      appStore.setData('app-update')
    }
  },
  // 开启数据缓存
  persist: {
    key: 'user',
    storage: localStorage,
    paths: ['name'],
    overwrite: true
  }
})
