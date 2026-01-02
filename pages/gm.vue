<template>
  <v-sheet class="pa-12" color="grey-lighten-3">
    <v-card class="mx-auto" max-width="400">
      <v-card-text>
        GM账号请联系管理员创建。
      </v-card-text>
    </v-card>
  </v-sheet>
</template>
<script setup>
import { useUserStore } from "~/store/client_auth"
const userStore = useUserStore()
onMounted(async () => {
  if (!await userStore.loadAuthUser()) {
    return navigateTo('/login')
  }
  if (!(userStore.userInfo.flag & 1)) {
    return navigateTo('/')
  }
})
</script>