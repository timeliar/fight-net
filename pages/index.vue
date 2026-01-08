<template>

  <v-navigation-drawer>
    <v-sheet class="pa-4" color="grey-lighten-4">
      <div class="d-flex align-center justify-space-around">
        <v-avatar class="mb-4" color="grey-darken-1" size="64">
          <v-img :alt="userStore.getUserInfo?.username"
            src="https://upload.wikimedia.org/wikipedia/commons/e/eb/WoW_icon.svg"></v-img>
        </v-avatar>
      </div>
      <div class="d-flex align-center justify-space-around">
        {{ userStore.getUserInfo?.username }}
      </div>
    </v-sheet>

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
  </v-navigation-drawer>
  <v-main class="d-flex align-center justify-center">
    <v-container>
      <v-sheet width="100%">
        <v-template v-for="(realm, i) in realms" :key="i">
          <v-card max-width="400" color="blue-grey-lighten-5">
            <v-card-title primary-title>
              {{ realm?.name }}
            </v-card-title>
            <v-card-subtitle>
              客户端 <code>WTF/Config.wtf</code> 配置如下： <br>
              <v-chip label>
                SET realmlist "{{ realm?.address }}"
              </v-chip>
            </v-card-subtitle>
            <v-card-text>
              地址：{{ realm?.address }} <br>
              端口：{{ realm?.port }} <br>
              版本：{{ realm?.gamebuild }} <br>
              时区：{{ RealmTimezone[realm?.timezone] }} <br>
              类型：<v-chip color="warning" size="x-small">{{ RealmIcon[realm?.icon] }}</v-chip>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn rounded size="small" dark color="success" @click="showRealmCharacters(realm?.id)">
                角色数：{{ realm?.numCharacters }}
              </v-btn>
              <v-btn rounded size="small" dark color="blue" class="ml-3" prepend-icon="mdi-currency-usd"
                @click="showRealmRates(realm?.rates)">
                倍率
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-template>
      </v-sheet>
    </v-container>
  </v-main>
  <v-dialog v-model="realmCharactersDialog" width="auto">
    <v-card prepend-icon="mdi-card-account-details-outline" title="角色">
      <v-card-text>
        <v-list>
          <template v-for="(char, index) in realmCharacters" :key="index">
            <v-list-item>
              <template v-slot:prepend>
                <v-avatar color="grey" class="mr-2">
                  <v-img :src="getCharClassIcon(char.class)" cover></v-img>
                </v-avatar>
                <v-avatar color="grey">
                  <v-img :src="getRaceIcon(char.race, char.gender)" cover></v-img>
                </v-avatar>
              </template>
              <div min-width="500">
                <v-list-item-title>
                  <v-btn :color="char.online ? 'green' : 'grey'" size="small" rounded
                    :prepend-icon="char.online ? 'mdi-wifi' : 'mdi-wifi-off'">
                    {{ char.name }}
                  </v-btn>
                </v-list-item-title>
                <v-list-item-subtitle class="mt-1">
                  <v-chip size="x-small" color="blue">
                    Lv.{{ char.level }}
                  </v-chip>
                  <v-chip size="x-small" :color="char.playerFlags & 16 ? 'grey' : 'green'">
                    {{ char.playerFlags & 16 ? '死了' : '活着' }}
                  </v-chip>
                </v-list-item-subtitle>
              </div>
              <template v-slot:append>
                <div class="ml-4">
                  <p class="text-subtitle-2">在线时长：{{ char.totaltime }}秒</p>
                  <p class="text-subtitle-2">下线时间：
                    {{ new Date(char.logout_time * 1000 || '').toLocaleString() || '未知' }}
                  </p>
                </div>
              </template>
            </v-list-item>
            <v-divider></v-divider>
          </template>
        </v-list>
      </v-card-text>
      <template v-slot:actions>
        <v-btn class="ms-auto" text="关闭" color="red" @click="realmCharactersDialog = false"></v-btn>
      </template>
    </v-card>
  </v-dialog>
  <v-dialog v-model="realmRatesDialog" width="auto">
    <v-card prepend-icon="mdi-currency-usd" title="倍率">
      <v-card-text>
        <v-list :items="realmRates" item-icon="icon">
          <v-list-item v-for="(item, i) in realmRates" :key="i" :value="item">
            <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
      <template v-slot:actions>
        <v-btn class="ms-auto" text="关闭" color="red" @click="realmRatesDialog = false"></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useUserStore } from "~/store/client_auth"
const userStore = useUserStore()
const realmCharactersDialog = ref(false)
const realmCharacters = ref([])
const realmRatesDialog = ref(false)
const realmRates = ref<{ title: string; icon: string }[]>([])
onMounted(async () => {
  if (!await userStore.loadAuthUser()) {
    return navigateTo('/login')
  }
})
import { Gender, Expansion, Locale, CharClass, Race, getCharClassIcon, getRaceIcon, RealmIcon, RealmTimezone } from "~/shared/enums"
import axios from 'axios';
const realms = ref([])
axios.get('/api/realmlist').then((response) => {
  realms.value = response.data
})

function showRealmCharacters(realmId: number) {
  axios.get(`/api/realmlist/${realmId}/characters`).then((response) => {
    realmCharacters.value = response.data.result.characters
    realmCharactersDialog.value = true
  })
}

function showRealmRates(rates: object) {
  realmRates.value = [
    { title: `金钱掉落：x${rates.dropMoney}`, icon: "mdi-gold" },
    { title: `任务经验：x${rates.xpQuest}`, icon: "mdi-panda" },
    { title: `探索经验：x${rates.xpExplore}`, icon: "mdi-paw" },
    { title: `生命恢复：x${rates.health}`, icon: "mdi-medication" },
    { title: `魔力恢复：x${rates.mana}`, icon: "mdi-battery-charging" },
    { title: `专注恢复：x${rates.focus}`, icon: "mdi-creation" },
    { title: `能量恢复：x${rates.energy}`, icon: "mdi-ev-station" },
    { title: `绿装掉落：x${rates.dropItemUncommon}`, icon: "mdi-scanner" },
    { title: `蓝装掉落：x${rates.dropItemRare}`, icon: "mdi-radio-handheld" },
    { title: `紫装掉落：x${rates.itemEpic}`, icon: "mdi-cellphone" },
    { title: `传奇掉落：x${rates.itemLenendary}`, icon: "mdi-laptop" },
  ]
  realmRatesDialog.value = true
}
</script>
<style scoped lang="scss"></style>