import { createStore } from 'vuex'

export interface RootState {
  appName: string
}

export default createStore<RootState>({
  state: {
    appName: 'Admin Checkout',
  },
  getters: {
    appName: (state) => state.appName,
  },
})
