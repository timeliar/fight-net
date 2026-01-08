<template>
    <v-layout theme="light">
        <!-- APP BAR -->
        <v-app-bar color="blue-darken-4" dark>
            <v-app-bar-nav-icon icon="mdi-axe-battle" to="/" />
            <v-app-bar-title>Fight.net</v-app-bar-title>
            <v-btn to="/login" v-if="!userStore.isLoggedIn">
                <v-icon>mdi-login</v-icon>
                登录
            </v-btn>
            <v-btn to="/register" v-if="!userStore.isLoggedIn">
                <v-icon>mdi-account-plus</v-icon>
                注册
            </v-btn>
            <v-menu :close-on-content-click="false" v-if="userStore.isLoggedIn">
                <template v-slot:activator="{ props }">
                    <v-btn rounded v-bind="props">
                        {{ userStore.getUserInfo?.username }}
                    </v-btn>
                </template>

                <v-card min-width="300">
                    <v-list>
                        <v-list-item prepend-avatar="https://upload.wikimedia.org/wikipedia/commons/e/eb/WoW_icon.svg"
                            :subtitle="userStore.getUserInfo?.email || '（未设置邮箱）'"
                            :title="userStore.getUserInfo?.username">
                            <template v-slot:append>
                                <v-btn color="red-accent-3" rounded to="/gm" v-if="userStore.userInfo?.flag & 1">
                                    <v-icon>mdi-fencing</v-icon>
                                    GM
                                </v-btn>
                            </template>
                        </v-list-item>
                    </v-list>

                    <v-divider></v-divider>

                    <v-list>
                        <v-list-item>
                            在线状态：
                            <v-chip :color="userStore.getUserInfo?.online ? 'green' : 'grey'" small>
                                {{ userStore.getUserInfo?.online ? '在线' : '离线' }}</v-chip>
                        </v-list-item>
                        <v-list-item>
                            最后登录：
                            {{ new Date(userStore.getUserInfo?.last_login || '').toLocaleString() || '未知' }}
                        </v-list-item>
                        <v-list-item>
                            版本：
                            {{ Expansion[userStore.getUserInfo?.expansion] || '未知' }}
                        </v-list-item>
                        <v-list-item>
                            锁定状态：
                            <v-chip :color="userStore.getUserInfo?.locked ? 'red' : 'green'" small>
                                {{ userStore.getUserInfo?.is_locked ? '已锁定' : '未锁定' }}</v-chip>
                        </v-list-item>
                        <v-list-item>
                            语言：
                            {{ Locale[userStore.getUserInfo?.locale] || '未知' }}
                        </v-list-item>
                    </v-list>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" variant="text" @click="logout">
                            <v-icon>mdi-logout</v-icon>
                            登出
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-menu>
        </v-app-bar>
        <!-- Main -->
        <slot />
    </v-layout>
</template>
<script setup lang="ts">
import { useUserStore } from "~/store/client_auth"
import { Expansion, Locale } from "~/shared/enums"
const userStore = useUserStore()
async function logout() {
    userStore.logout()
    await navigateTo('/')
}
</script>
<style scoped lang="scss"></style>