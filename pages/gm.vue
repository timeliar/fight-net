<template>
  <v-navigation-drawer class="bg-gray" theme="dark" permanent>
    <v-list color="transparent">
      <v-list-item>
        <v-btn color="primary" block>创建用户</v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn color="error" block>创建用户</v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn color="success" block>创建用户</v-btn>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn block>
          关闭服务器
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
  <v-main style="height: 400px"></v-main>
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