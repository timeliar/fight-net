import { defineStore } from 'pinia'
import axios from 'axios';
export const useUserStore = defineStore('user', {
    state: () => ({
        userInfo: null as any,
        accessToken: null as string | null,
    }),
    actions: {
        login(token: string) {
            this.accessToken = token
            localStorage.setItem('accessToken', token)
            this.userInfo = null
        },
        logout() {
            this.accessToken = null
            this.userInfo = null
            localStorage.removeItem('accessToken')
        },
        async loadAuthUser() {
            if (this.userInfo && this.accessToken) {
                return this.userInfo
            }
            const token = localStorage.getItem('accessToken')
            if (token) {
                this.accessToken = token
                const ret = await axios.get('/api/account');
                this.userInfo = ret.data.result
                return this.userInfo
            }
            return null
        }
    },
    getters: {
        getUserInfo: state => state.userInfo,
        isLoggedIn: state => state.accessToken !== null && state.userInfo !== null,
    }
})