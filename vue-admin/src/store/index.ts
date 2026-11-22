import { api } from '@/services/api'
import type { IAuthenticatedUser } from '@/types/user.interface'
import { createStore } from 'vuex'


export interface RootState {
  appName: string
  user: IAuthenticatedUser | null
}

export default createStore<RootState>({
  state: {
    appName: 'Admin Checkout',
    user: null,
  },
  mutations: {
    setUser(state, user: IAuthenticatedUser | null) {
      state.user = user
    },
  },
  actions: {
    async fetchAuthenticatedUser({ commit }) {
      const { data } = await api.get<IAuthenticatedUser>('/user')
      commit('setUser', data)
      return data
    },
  },
  getters: {
    appName: (state) => state.appName,
  },
})
